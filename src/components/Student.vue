<template>
    <div>
         <header>
            <h1>
                IT技術者養成サイト
            </h1>
            <!-- <div>
                <a href="./teacher" target="_blank">講師用ページ</a>
                <a href="./admin" target="_blank">管理者ページ</a>
                <a href="./logout">ログアウト</a><br>
            </div> -->
        </header>
        <div id="app">
            <ul class="nav">
                <!-- <li>
                    <router-link>テキスト</router-link>
                </li> -->
                <li>
                    <router-link to="/student/answer">模範解答</router-link>
                </li>
            </ul>
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

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