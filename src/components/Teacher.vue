<template>
    <div>
        <header>
            <h1>
                IT技術者養成サイト（講師）
            </h1>
            <div>
                
            </div>
            
        </header>

        <div class="content" v-cloak>
            <ul class="nav">
                <li>
                    <router-link to="/teacher/document">ドキュメント</router-link>
                </li>
                <li>
                    <router-link to="/teacher/textdisp">教材管理</router-link>
                </li>
                <li>
                    <router-link to="/teacher/answer">模範解答</router-link>
                </li>

                <li v-for="(table, index) in tableList" v-bind:key="'table-'+index" class="nav-item">
                    <router-link v-bind:to="'/teacher/' + table.table_name">{{ table.table_comment }}</router-link>
                </li>

                <li v-for="(calendar, index) in calendarList" v-bind:key="'calendar'+index" class="nav-item">
                    <router-link v-bind:to="'/teacher/' + calendar.table_name">{{ calendar.table_comment }}</router-link>
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
        }
    },
    methods: { 
        getUseTableList() {
            let params = new URLSearchParams();
            params.append('account_level', 2);
            params.append('type', 1); // マスタ
            fetch('http://localhost:8888/axiz-php/getUseTableList', {
                method: 'post',
                body: params,
            })
            .then(response => response.json()
                .then(json => this.tableList = json))
            .catch(error => console.log(error))

            params = new URLSearchParams();
            params.append('account_level', 2);
            params.append('type', 2); // カレンダー
            fetch('http://localhost:8888/axiz-php/getUseTableList', {
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
    },    
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
    /* width: 25%; */
    width: 200px;
}
main {
    /* width: 75%; */
    width: 1300px;
}
.content {
    /* width: 100%; */
    display: flex;
}
</style>