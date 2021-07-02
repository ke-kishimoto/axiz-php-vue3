<template>
    <div>
        <br>
        <button class="btn btn-primary" @click="createTables">作成</button>
        <button class="btn btn-danger" @click="deleteTables">削除</button><br>
        <br>
        <table class="table table-bordered">
            <tr>
                <th>テーブル名（物理）</th>
                <th>テーブル名（論理）</th>
                <th>対象</th>
            </tr>
            <tr v-for="(table, index) in tableDefList" v-bind:key="index">
                <td>{{ table.table_name }}</td>
                <td>{{ table.table_comment }}</td>
                <td><input type="checkbox" v-model="tableCheckList" v-bind:value="table.table_name"></td>
            </tr>
        </table>
    </div>
</template>
<script>
export default {
    data: function() {
        return  {
            tableDefList: [],       
            tableCheckList: [],
            urlPrefix : 'http://localhost:8888/axiz-php',
        }
    },
    methods: {
        createTables() {
            const ans = confirm('作成してよろしいですか？');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableList', this.tableCheckList);
            // テーブル作成
            // axios.post('./createTables', params)
            // .then(res => {
            //     if(res.status !== 200) {
            //         console.log(res.data);
            //         alert('エラーが発生しました。');
            //     } else {
            //         alert('正常に完了しました。');
            //     }
            // });
            fetch(this.urlPrefix + '/createTable', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status === 200) {
                    alert('正常に完了しました。');
                } else {                        
                    res.text().then(text => console.log(text));
                    alert('エラーが発生しました。');
                }
            })
        },
        deleteTables() {
            const ans = confirm('削除してよろしいですか？');
            if(!ans) return;
            let params = new URLSearchParams();
            params.append('tableList', this.tableCheckList);
            // テーブル削除
            // axios.post('./deleteTables', params)
            // .then(res => {
            //     if(res.status !== 200) {
            //         console.log(res.data);
            //         alert('エラーが発生しました。');
            //     } else {
            //         alert('正常に完了しました。');
            //     }
            // });
            fetch(this.urlPrefix + '/deleteTables', {
                method: 'post',
                body: params
            })
            .then(res => {
                if(res.status === 200) {
                    alert('正常に完了しました。');
                } else {
                    res.text().then(text => console.log(text))
                    alert('エラーが発生しました。');
                }
            })
        }
    },
    created: function() {
        fetch(this.urlPrefix + '/getTableList', {
            method: 'post',
        })
        .then(res => res.json().then(json => this.tableDefList = json))
        .catch(error => console.log(error))
    }
}
</script>