<template>
    <div id="top">
        <div class="head">
            <div>
                <button class="btn btn-primary my-2" @click="newRegist">登録</button>
                <button class="btn btn-primary my-2" @click="openCsvUpModal">CSV取込</button>
                <button class="btn btn-primary my-2" @click="openCsvOutModal">CSV出力</button>
            </div>
            <div class="search">
                <select v-model="whereColumn">
                    <option value="">絞り込み項目</option>
                    <option v-for="column in columnList" v-bind:key="column.column_name" v-bind:value="column.column_name">{{ column.column_comment }}</option>
                </select>
                <input type="text" v-model="whereValue">
                <select v-model="order">
                    <option value="">並び替え項目</option>
                    <option v-for="column in columnList" v-bind:key="column.column_name" v-bind:value="column.column_name">{{ column.column_comment }}</option>
                </select>
                <select v-model="orderOption">
                    <option value="">並び順</option>
                    <option value="asc">昇順</option>
                    <option value="desc">降順</option>
                </select>
                <input type="text" placeholder="フリーワード検索" v-model="keyword">
                <button class="btn btn-primary my-2" @click="search">検索</button>
                <button class="btn btn-danger my-2" @click="bulkDelete">削除</button>
            </div>
        </div>
        <span>{{ msg }}</span>
        <!-- 一覧表 -->
        <table class="table">
            <tr>
                <th>削除</th>
                <th>更新</th>
                <!-- <th v-for="column in columnList" v-bind:key="column.column_name">
                    <template v-if="column.column_name !== 'id' && column.column_name !== 'account_id'">
                        {{ column.column_comment }}
                    </template>
                </th> -->
                <template v-for="column in columnList" >
                    <th v-if="column.column_name !== 'id' && column.column_name !== 'account_id'" v-bind:key="column.column_name">
                            {{ column.column_comment }}
                    </th>
                </template>
            </tr>
            <tr v-for="data in list" v-bind:key="data.id">
                <td><input type="checkbox" v-model="idList" v-bind:value="data.id"></td>
                <td>
                    <button v-if="accountId == data.account_id" class="btn btn-primary" @click="edit(data)">更新</button>
                    <button v-else class="btn btn-secondary" @click="view(data)">参照</button>
                </td>
                <td v-for="column in columnList" v-bind:key="column.column_name">
                    <template v-if="column.column_name !== 'id' && column.input_type !== 'textarea'">
                        <pre>{{ data[column.column_name] }}</pre>
                    </template>
                </td>
            </tr>
        </table>
        <!-- Csv出力用 -->
        <CsvOutModal @close="closeCsvOutModal" v-if="csvOutModal">
            <template v-slot:columnList>
                <div v-for="column in columnList" v-bind:key="column.column_name" class="form-check">
                    <input class="form-check-input" type="checkbox" v-bind:value="column.column_name" v-model="csvOutputColumn">
                    <label class="form-check-label" v-bind:for="column.columun_name">
                        {{ column.column_comment }}
                    </label>
                </div>
            </template>
        </CsvOutModal>
        <!-- CSV取込用 -->
        <CsvUpModal @close="closeCsvUpModal" v-if="csvUpModal">
        </CsvUpModal>
    </div>
</template>

<script>
import CsvOutModal from './CsvOutModal.vue'
import CsvUpModal from './CsvUpModal.vue'
export default {
    components: { CsvOutModal, CsvUpModal },
    name: 'CsvList',
    // props: ['title', 'tableName'],
    data: function() {
        return {
            title: '',
            tableName: '',
            columnList: [],
            list: [],
            keyword: '',
            order: '',
            orderOption: '',
            idList: [],
            msg: '',
            csvHeadType: 'disp',
            csvOutputColumn: [],
            whereColumn: '',
            whereValue: '',
            csvOutModal: false,
            csvUpModal: false,
            message: '',
            urlPrefix : 'http://localhost:8888/axiz-php',
            accountId: ''
        }
    },
    methods: {
        openCsvOutModal() {
            this.csvOutModal = true
        },
        closeCsvOutModal() {
            this.csvOutModal = false
        },
        openCsvUpModal() {
            this.csvUpModal = true
        },
        closeCsvUpModal() {
            this.csvUpModal = false
        },
        newRegist() {
            this.$router.push({name:'editModal', query: {tableName: this.tableName, editId: -1, title: this.title, readonlyFlg: false}});
        },
        search() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('whereColumn', this.whereColumn);
            params.append('whereValue', this.whereValue);
            params.append('keyword', this.keyword);
            let order = this.order !== '' ? this.order + ' ' + this.orderOption : '';
            params.append('order', order);
            fetch(this.urlPrefix + '/searchList', {
                method: 'post',
                body: params
            }).then(res => {
                if(res.status !== 200) {
                    console.log(res);
                }else {
                    res.json().then(json => this.list = json);
                }
            })
            .catch(errors => console.log(errors))
        },
        
        edit(data) {
            this.$router.push({name:'editModal', query: {tableName: this.tableName, editId: data.id, title: this.title, readonlyFlg: false}});
        },
        view(data) {
            this.$router.push({name:'editModal', query: {tableName: this.tableName, editId: data.id, title: this.title, readonlyFlg: true}});
        },
        bulkDelete() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('idList', this.idList);
            fetch(this.urlPrefix + '/bulkDelete', {
                method:'post',
                body:params
            })
            .then(() => this.search())
            .catch(errors => console.log(errors))
        },
        
        init() {
            this.accountId = this.$route.params.accountId
            this.tableName = this.$route.params.tableName
            this.search();
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            fetch(this.urlPrefix + '/getColumnList', {
                method:'post',
                body: params
            })
            .then(res => res.json()
                .then(json => {
                    this.columnList = json;
                })
            )
            .catch(errors => console.log(errors))
        }
    },
    created: function() {
        this.init();
    },
    watch: {
        // tableName () {
        //     // tableNameプロパティが変更された時の処理
        //     this.init();
        // }
        $route() {
            this.init();
        }
    }
}
</script>

<style scoped>
#top {
    margin: 10px 50px;
}

table tr th {
    min-width: 50px;
}
table tr td pre {
    white-space: pre-wrap;
}
</style>