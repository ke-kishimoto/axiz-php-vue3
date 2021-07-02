<template>
    <div>
        <br>
        <p>
            <select @change="selectCategory($event)">
                <option v-for="data in selectList" v-bind:key="data.id" v-bind:value="data.id">{{ data.name }}</option>
            </select>
        </p>
        <br>
        <!-- 一覧表 -->
        <table class="table table-bordered">
            <tr>
                <template v-for="column in columnList">
                    <th  v-if="column.column_name !== 'id' && column.column_name !== 'account_id'" v-bind:key="column.ordinal_position">
                        {{ column.column_comment }}
                    </th>
                </template>
                <th>ステータス</th>
            </tr>
            <tr v-for="data in dataList" v-bind:key="data.id">
                <template v-for="column in columnList">
                    <td v-if="column.column_name !== 'id' && column.column_name !== 'account_id'" v-bind:key="column.ordinal_position">
                        {{ data[column.column_name] }}
                    </td>
                </template>
                <td v-if="data.flg === '1'"><button class="btn btn-primary" @click="selectedSwitch(data)">{{ flgName1 }}</button></td>
                <td v-else><button class="btn btn-danger" @click="selectedSwitch(data)">{{ flgName2 }}</button></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props: ['selectTableName', 'listTableName','accountId', 'flgName1', 'flgName2'],
    data: function() {
        return {
            selectList:[],
            columnList: [],
            dataList: [],
            urlPrefix : 'http://localhost:8888/axiz-php',
        }
    },
    methods: {
        getSelectList() {
            let params = new URLSearchParams();
            params.append('tableName', this.selectTableName);
            params.append('accountId', this.accountId);
            fetch(this.urlPrefix + '/getSelectboxList', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status === 200) {
                    res.json()
                    .then(json => {
                        this.selectList = json;
                        this.getList(this.selectList[0].id);    
                    })
                }
            })
            .catch(error => console.log(error))
        },
        selectCategory(event) {
            this.getList(event.target.value);
        },
        selectedSwitch(data) {
            let params = new URLSearchParams();
            params.append('id', data.id);
            params.append('tableName', this.listTableName);
            fetch(this.urlPrefix + '/updateFlg', {
                method: 'post',
                body: params
            })
            .then(res => res.json().then(json => data.flg = json))
            .catch(error => console.log(error))
        },
        getList(selectId) {
            let params = new URLSearchParams();
            params.append('tableName', this.listTableName);
            params.append('id', selectId);
            fetch(this.urlPrefix + '/getSwitchList', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status === 200) {
                    res.json()
                    .then(json => {
                        this.dataList = json;
                    })
                }
            })
            .catch(error => console.log(error))
        },
        init() {
            let params = new URLSearchParams();
            params.append('tableName', this.listTableName);
            fetch(this.urlPrefix + '/getSwitchColumnList', {
                method: 'post',
                body: params
            })
            .then(res => res.json()
                .then(json => {
                    this.columnList = json;
                    this.getSelectList();
                })
            )
            .catch(error => console.log(error))
            }
    },
    created: function() {
        this.init()
    },
    watch: {
        listTableName() {
            this.init()
        }
    }
}
</script>