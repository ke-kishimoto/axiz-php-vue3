<template>
    <div>
        <header>
            <h1>
                IT技術者養成サイト（講師）
            </h1>
            <div>
                
            </div>
            
        </header>

        <div id="app" v-cloak>
            <ul class="nav">
                <li>
                    <router-link to="/teacher/document">ドキュメント</router-link>
                </li>
                <li>
                    <!-- <a class="nav-link" id="text-disp-tab" data-toggle="tab" href="#text-disp">教材管理</a> -->
                    <router-link to="/teacher/textdisp">教材管理</router-link>
                </li>
                <li>
                    <!-- <a class="nav-link" id="answer-tab2" href="#answer2">模範解答</a> -->
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
      
            
                <!-- 教材管理 -->
                <!-- <div class="tab-pane fade " id="text-disp" role="tabpanel" aria-labelledby="text-disp-tab">
                    <custom-switch-list select-table-name="AccountRoom" list-table-name="SubjectDisp" account-id="<?php echo $_SESSION['user']['id'] ?>" flg-name1="表示" flg-name2="非表示"></custom-switch-list>
                </div> -->
            
                <!-- 模範解答 -->
                <!-- <div class="tab-pane fade" id="answer2" role="tabpanel" aria-labelledby="answer-tab2">
                    <custom-switch-list select-table-name="AccountRoom" list-table-name="AnswerDisp" account-id="<?php echo $_SESSION['user']['id'] ?>" flg-name1="表示" flg-name2="非表示"></custom-switch-list>
                </div> -->

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