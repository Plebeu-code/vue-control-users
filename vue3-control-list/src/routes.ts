import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [{
  path: '/',
  component: import('./views/search.vue'),
},
{
  path: '/register',
  component: import('./views/register.vue'),
},
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
