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
        <div>
            <ul class="nav">
                <li>

                </li>
            </ul>
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>