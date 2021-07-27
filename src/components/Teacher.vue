<template>
    <div>
        <header>
            <h1>
                IT技術者養成サイト（講師）
            </h1>
            <div>
                <a href="./student" target="_blank">研修生ページ</a>
                <a href="./teacher" target="_blank">研修生ページ</a>
                <a href="./admin" target="_blank">管理者用ページ</a>
                <a href="./logout">ログアウト</a><br>
            </div>
            
        </header>

        <div class="content" v-cloak>
            <ul class="nav">
                <li>
                    <router-link v-bind:to="'/teacher/' + accountId + '/document'">ドキュメント</router-link>
                </li>
                <li>
                    <router-link v-bind:to="'/teacher/' + accountId + '/textdisp'">教材管理</router-link>
                </li>
                <li>
                    <router-link v-bind:to="'/teacher/' + accountId + '/answer'">模範解答</router-link>
                </li>

                <li v-for="(table, index) in tableList" v-bind:key="'table-'+index" class="nav-item">
                    <router-link v-bind:to="'/teacher/' + accountId + '/csvlist/' + table.table_name">{{ table.table_comment }}</router-link>
                </li>

                <li v-for="(calendar, index) in calendarList" v-bind:key="'calendar'+index" class="nav-item">
                    <router-link v-bind:to="'/teacher/' + accountId + '/calendar/' + calendar.table_name">{{ calendar.table_comment }}</router-link>
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
    data: function () {
        return {
            tableList: [],
            calendarList: [],
            urlPrefix : 'http://localhost:8888/axiz-php',
            accountId: '',
        }
    },
    methods: { 
        getUseTableList() {
            let params = new URLSearchParams();
            params.append('account_level', 2);
            params.append('type', 1); // マスタ
            fetch(this.urlPrefix + '/getUseTableList', {
                method: 'post',
                body: params,
            })
            .then(response => response.json()
                .then(json => this.tableList = json))
            .catch(error => console.log(error))

            params = new URLSearchParams();
            params.append('account_level', 2);
            params.append('type', 2); // カレンダー
            fetch(this.urlPrefix + '/getUseTableList', {
                method: 'post',
                body: params,
            })
            .then(response => response.json()
                .then(json => this.calendarList = json))
            .catch(error => console.log(error))
        },
    },
    created: function() {
        this.getUseTableList();
        this.accountId = this.$route.params.accountId
    },    
}
</script>
<style scoped>
h1 {
    margin: 0;
}
ul.nav {
    list-style: none;
    margin-top: 30px;
    padding: 0;
    /* width: 25%; */
    width: 200px;
}
ul.nav li {
    margin: 0;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #eee;
    text-align: center;
    line-height: 40px;
}
ul.nav li a {
    display: inline-block;
    height: 100%;
    width: 100%;
    text-decoration: none;
    color: black;
}
main {
    /* width: 75%; */
    width: 1300px;
}
.content {
    /* width: 100%; */
    display: flex;
}
header {
    display: flex;
}
header a {
    margin: 10px;
}
</style>