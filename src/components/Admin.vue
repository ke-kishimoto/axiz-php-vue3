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
        <div class="content" v-cloak>
            <ul class="nav">
                <li v-for="(table, index) in tableList" v-bind:key="'table-'+index">
                    <router-link v-bind:to="'/admin/' + table.table_name">{{ table.table_comment }}</router-link>
                </li>
                <li>
                    <router-link to="/admin/tableManagement">テーブル作成</router-link>
                </li>
            </ul>
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return  {
            tableDefList: [],       
            tableList: [],
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
        
    },
    created: function() {
        this.getUseTableList();
    }
}
</script>

<style scoped>
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
/* #app {
    width: 100%;
    display: flex;
} */
</style>