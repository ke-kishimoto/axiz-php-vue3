<template>
    <div id="top">
        <div class="head">
            <div>
                <button class="btn btn-primary my-2" @click="newRegist">登録</button>
                <button class="btn btn-primary my-2" @click="a">CSV取込</button>
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
        <table class="table table-bordered">
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
                    <template v-if="column.column_name !== 'id'">
                        <pre>{{ data[column.column_name] }}</pre>
                    </template>
                </td>
            </tr>
        </table>
         <!-- コンポーネント OutCsvModal -->
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
        <!-- CSV取込用 モーダルウィンドウ -->
        <!-- <modal :name="tableName+'-csv-modal'" :scrollable="true" height="auto">
            <div class="container">
                <h2>CSV取込</h2>
                <input type="file" name="fname" @change="selectedFile">
                <div class="modal-btn">
                    <button class="btn btn-primary my-2" @click="upload">CSV取込</button>
                    <button class="btn btn-primary my-2" @click="closeModal(tableName+'-csv-modal')">閉じる</button>
                </div>
            </div>
        </modal> -->
    </div>
</template>

<script>
import CsvOutModal from './CsvOutModal.vue'
export default {
    components: { CsvOutModal },
    name: 'CsvList',
    props: ['title', 'tableName', 'accountId'],
    data: function() {
        return {
            columnList: [],
            list: [],
            keyword: '',
            order: '',
            orderOption: '',
            idList: [],
            msg: '',
            uploadFile: null,
            csvHeadType: 'disp',
            csvOutputColumn: [],
            whereColumn: '',
            whereValue: '',
            csvOutModal: false,
            message: '',
        }
    },
    methods: {
        openCsvOutModal() {
            this.csvOutModal = true
        },
        closeCsvOutModal() {
            this.csvOutModal = false
        },
        newRegist() {
            this.$router.push({name:'editModal', query: {tableName: this.tableName, editId: -1, title: this.title}});
        },
        search() {
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('whereColumn', this.whereColumn);
            params.append('whereValue', this.whereValue);
            params.append('keyword', this.keyword);
            let order = this.order !== '' ? this.order + ' ' + this.orderOption : '';
            params.append('order', order);
            fetch('http://localhost:8888/axiz-php/searchList', {
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
            this.$router.push({name:'editModal', query: {tableName: this.tableName, editId: data.id, title: this.title}});
        },
        view(data) {
            this.$router.push({name:'viewModal', query: {tableName: this.tableName, editId: data.id, title: this.title}});
        },
        bulkDelete() {
            const ans = confirm('削除してよろしいですか');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            params.append('idList', this.idList);
            fetch('http://localhost:8888/axiz-php/bulkDelete', {
                method:'post',
                body:params
            })
            .then(() => this.search())
            .catch(errors => console.log(errors))
        },
        selectedFile: function(e) {
            // 選択された File の情報を保存しておく
            e.preventDefault();
            let files = e.target.files;
            this.uploadFile = files[0];
        },
        upload: function() {
            // FormData を利用して File を POST する
            let formData = new FormData();
            formData.append('csvfile', this.uploadFile);
            formData.append('tableName', this.tableName);
            // let config = {
            //     headers: {
            //         'content-type': 'multipart/form-data'
            //     }
            // };
            // axios
            //     .post('./uploadCSV', formData, config)
            //     .then(res => {
            //         if(res.status !== 200) {
            //             console.log(res.data);
            //         } else if(res.data.err_msg !== '') {
            //             this.msg = res.data.err_msg
            //         } else {
            //             this.msg = res.data.cnt + '件登録';
            //             this.search();
            //         }
            //         this.uploadFile = null;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     })
                this.$modal.hide(this.tableName + '-csv-modal');
        },
        init() {
            this.search();
            let params = new URLSearchParams();
            params.append('tableName', this.tableName);
            fetch('http://localhost:8888/axiz-php/getColumnList', {
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
        tableName () {
            // tableNameプロパティが変更された時の処理
            this.init();
        }
    }
}
</script>

<style>
#top {
    max-width: 900px;
}
div.head {
    width: 900px;
    display: flex;
    justify-content: space-between;
}
table tr  {
    max-width: 900px;
}
table tr th {
    min-width: 50px;
}
table tr td pre {
    white-space: pre-wrap;
    /* flex-wrap: wrap; */
}
</style>