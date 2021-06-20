import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Login from './components/Login.vue'
import Test from './components/Test.vue'
import Teacher from './components/Teacher.vue'
import SwitchList from './components/SwitchList.vue'
import CsvList from './components/CsvList.vue'
import Calendar from './components/Calendar.vue'
import TeacherDoc from './components/TeacherDoc.vue'

const app = createApp(App)
const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
      },
      {
        path: '/test',
        name: 'test',
        component: Test 
      },
      {
        path: '/teacher',
        name: 'teacher',
        component: Teacher,
        children: [
            {
                path: '',
                component: TeacherDoc,
            },
            {
                path: 'document',
                component: TeacherDoc,
            },
            {
                path: 'textdisp',
                component: SwitchList,
                props:{selectTableName: 'AccountRoom', listTableName: 'SubjectDisp', accountId: 1, flgName1: '表示', flgName2: '非表示'}
            },
            {
                path: 'answer',
                component: SwitchList,
                props:{selectTableName: 'AccountRoom', listTableName: 'AnswerDisp', accountId: 1, flgName1: '表示', flgName2: '非表示'}
            },
            {
                path: 'qa',
                name: 'QA',
                component: CsvList,
                props:{title: 'QA', tableName: 'QA', accountId: 1}
            },
            {
                path: 'feedback',
                name: 'Feedback',
                component: CsvList,
                props:{title: '研修フィードバック', tableName: 'Feedback', accountId: 1}
            },
            {
                path: 'review',
                name: 'Review',
                component: CsvList,
                props:{title: 'レビュー', tableName: 'Review', accountId: 1}
            },
            {
                path: 'reportcomment',
                name: 'ReportCooment',
                component: CsvList,
                props:{title: '報告書コメント', tableName: 'ReportComment', accountId: 1}
            },
            {
                path: 'dayoverview',
                name: 'DayOverview',
                component: Calendar,
                props:{title: '1日の概要', tableName: 'DayOverview', accountId: 1}
            },
            {
                path: 'statusreport',
                name: 'StatusReport',
                component: Calendar,
                props:{title: '講師状況報告書', tableName: 'StatusReport', accountId: 1}
            },
          ]
      },
  ]

const router = createRouter({
    mode: 'history',
    history: createWebHistory(),
    routes: routes
})
  
app.use(router)
app.mount('#app')

