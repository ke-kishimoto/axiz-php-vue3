import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import Login from './components/Login.vue'
import Teacher from './components/Teacher.vue'
import Admin from './components/Admin.vue'
import Student from './components/Student.vue'
import EditModal from './components/EditModal.vue'
import ViewModal from './components/ViewModal.vue'
import TableManagement from './components/TableManagement.vue'
import LinkList from './components/LinkList.vue'
import SimpleList from './components/SimpleList.vue'
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
        path: '/student',
        name: 'student',
        component: Student,
        children: [
            {
                path: 'answer',
                name: 'answer',
                component: LinkList,
                props:{selectTableName: 'AccountRoom', listTableName: 'ModelAnswer', accountId: 1}
            }
        ]
    },
    {
        path: '/teacher/:accountId/',
        name: 'teacher',
        component: Teacher,
        children: [
            {
                path: '',
                component: TeacherDoc,
            },
            {
                path: 'editModal',
                name: 'editModal',
                component: EditModal,
            },
            {
                path: 'viewModal',
                name: 'viewModal',
                component: ViewModal,
            },
            {
                path: 'document',
                component: TeacherDoc,
            },
            {
                path: 'textdisp',
                component: SwitchList,
                props:{selectTableName: 'AccountRoom', listTableName: 'SubjectDisp', flgName1: '表示', flgName2: '非表示'}
            },
            {
                path: 'answer',
                component: SwitchList,
                props:{selectTableName: 'AccountRoom', listTableName: 'AnswerDisp', flgName1: '表示', flgName2: '非表示'}
            },
            {
                path: 'csvlist/:tableName',
                name: 'csvlist/:tableName',
                component: CsvList,
            },

            {
                path: 'calendar/:tableName',
                name: 'calendar/:tableName',
                component: Calendar,
            },
          ]
      },
      {
        path: '/admin',
        name: 'admin',
        component: Admin,
        children: [
            {
                path: 'tablemanagement',
                name: 'TableManagement',
                component: TableManagement,
            },
            {
                path: 'room',
                name: 'Room',
                component: SimpleList,
                props:{title: '教室', tableName: 'Room', accountId: 1}
            },
            {
                path: 'account',
                name: 'Account',
                component: SimpleList,
                props:{title: 'アカウント', tableName: 'Account', accountId: 1}
            },
            {
                path: 'subject',
                name: 'Subject',
                component: SimpleList,
                props:{title: '科目', tableName: 'Subject', accountId: 1}
            },
            {
                path: 'answerpath',
                name: 'AnswerPath',
                component: SimpleList,
                props:{title: '模範解答', tableName: 'AnswerPath', accountId: 1}
            },
            {
                path: 'category',
                name: 'Category',
                component: SimpleList,
                props:{title: 'カテゴリ', tableName: 'Category', accountId: 1}
            },
            {
                path: 'accountroom',
                name: 'AccountRoom',
                component: SimpleList,
                props:{title: 'アカウント-教室', tableName: 'AccountRoom', accountId: 1}
            },
            {
                path: 'tabledef',
                name: 'TableDef',
                component: SimpleList,
                props:{title: 'テーブル管理', tableName: 'TableDef', accountId: 1}
            },
            {
                path: 'columndef',
                name: 'ColumnDef',
                component: SimpleList,
                props:{title: 'カラム管理', tableName: 'ColumnDef', accountId: 1}
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

