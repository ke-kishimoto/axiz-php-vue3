import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
// import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import Login from './components/Login.vue'
import Test from './components/Test.vue'
import Teacher from './components/Teacher.vue'
import CsvList from './components/CsvList.vue'

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
              path: 'csvlist/qa',
              name: 'qa',
              component: CsvList,
              props:{title: 'QA', tableName: 'QA', accountId: 1}
            }
          ]
      },
    //   {
    //     path: '/csvlist/qa',
    //     name: 'qa',
    //     component: CsvList,
    //     props:{title: 'QA', tableName: 'QA', accountId: 1}
    //   }
  ]

  const router = createRouter({
    mode: 'history',
    history: createWebHistory(),
    routes: routes
  })
  
app.use(router)
app.mount('#app')

