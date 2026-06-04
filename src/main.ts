import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/variables.css'
import './styles/global.css'

const routes = [
  { path: '/', redirect: '/office' },
  {
    path: '/',
    component: () => import('./components/layout/LCShell.vue'),
    children: [
      { path: 'office', component: () => import('./components/pages/OfficePage.vue'), meta: { title: '主管办公室' } },
      { path: 'abnormalities', component: () => import('./components/pages/AbnormalitiesPage.vue'), meta: { title: '异想体' } },
      { path: 'personnel', component: () => import('./components/pages/PersonnelPage.vue'), meta: { title: '员工' } },
      { path: 'ego', component: () => import('./components/pages/EgoPage.vue'), meta: { title: 'E.G.O.' } },
      { path: 'map', component: () => import('./components/pages/MapPage.vue'), meta: { title: '部门地图' } },
      { path: 'terminal', component: () => import('./components/pages/TerminalPage.vue'), meta: { title: 'AI 终端' } },
      { path: 'logs', component: () => import('./components/pages/LogsPage.vue'), meta: { title: '日志' } },
      { path: 'settings', component: () => import('./components/pages/SettingsPage.vue'), meta: { title: '设置' } },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })
const pinia = createPinia()
const app = createApp(App)
app.use(router).use(pinia).mount('#app')
