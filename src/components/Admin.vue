<template>
    <div>
        <header>
            <h1>
                IT技術者養成サイト（管理者）
            </h1>
            <div>
                <a href="./student" target="_blank">研修生ページ</a>
                <a href="/teacher" target="_blank">講師用ページ</a>
                <a href="./logout">ログアウト</a><br>
            </div>
        </header>
        <div id="app" v-cloak>

            <ul class="nav">

                <li v-for="(table, index) in tableList" v-bind:key="'table-'+index">
                    <!-- <a class="nav-link"  data-toggle="tab" v-bind:href="'#'+table.table_name" role="tab" aria-controls="profile" aria-selected="false">
                        {{ table.table_comment }}
                    </a> -->
                    <router-link v-bind:to="'/admin/' + table.table_name">{{ table.table_comment }}</router-link>
                </li>

                <li>
                    <a class="nav-link" id="table-create-tab" data-toggle="tab" href="#table-create" aria-selected="false">
                        テーブル作成
                    </a>
                </li>
            </ul>
            <main>
                <router-view></router-view>
            </main>

            <!-- <div class="tab-content">

                <div v-for="table in tableList" class="tab-pane fade" v-bind:id="table.table_name" role="tabpanel" v-bind:aria-labelledby="table.table_name+'-tab'">
                    <custom-list-simple v-bind:title="table.title_comment" v-bind:table-name="table.table_name" account-id="<?php echo $_SESSION['user']['id'] ?>"></custom-list-simple>
                </div>      
                
                <div class="tab-pane fade" id="table-create" role="tabpanel" aria-labelledby="table-create-tab">
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
                        <tr v-for="table in tableDefList">
                            <td>{{ table.table_name }}</td>
                            <td>{{ table.table_comment }}</td>
                            <td><input type="checkbox" v-model="tableCheckList" v-bind:value="table.table_name"></td>
                        </tr>
                    </table>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return  {
            tableDefList: [],       
            tableList: [],
            tableCheckList: [],
        }
    },
    methods: {
        getUseTableList() {
            let params = new URLSearchParams();
            params.append('account_level', 3);
            params.append('type', 1); // マスタ
            fetch('http://localhost:8888/axiz-php/getUseTableList', {
                method: 'post',
                body: params,
            })
            .then(res => res.json().then(json => this.tableList = json))
            .catch(error => console.log(error))
        },
        // createTables() {
        //     const ans = confirm('作成してよろしいですか？');
        //     if(!ans) return;
        //     let params = new URLSearchParams();
        //     params.append('tableList', this.tableCheckList);
        //     // テーブル作成
        //     axios.post('./createTables', params)
        //     .then(res => {
        //         if(res.status !== 200) {
        //             console.log(res.data);
        //             alert('エラーが発生しました。');
        //         } else {
        //             alert('正常に完了しました。');
        //         }

        //     });
        // },
        // deleteTables() {
        //     const ans = confirm('削除してよろしいですか？');
        //     if(!ans) return;
        //     let params = new URLSearchParams();
        //     params.append('tableList', this.tableCheckList);
        //     // テーブル削除
        //     axios.post('./deleteTables', params)
        //     .then(res => {
        //         if(res.status !== 200) {
        //             console.log(res.data);
        //             alert('エラーが発生しました。');
        //         } else {
        //             alert('正常に完了しました。');
        //         }

        //     });
        // }
    },
    created: function() {
        this.getUseTableList();
        fetch('http://localhost:8888/axiz-php/getTableList', {
            method: 'post',
        })
        .then(res => res.json().then(json => this.tableDefList = json))
        .catch(error => console.log(error))
    }
}
</script>

<style>
h1 {
    margin: 0;
}
ul.nav {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 25%;
}
main {
    /* width: 75%; */
}
#app {
    width: 100%;
    display: flex;
}
</style>