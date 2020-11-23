import { createApp } from 'vue'
import App from './App.vue'
import Columns from './components/Columns.vue'
import Host from './components/Host.vue'
import store from './store.js'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: App,
    children: [
      {path: '/register', component: Host},
      {path: '/settings', component: Columns},      
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let app = createApp({})
app.use(store)
app.use(router)
app.mount('#app')
