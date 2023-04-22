import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import store from '@/store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/itemMusic',
    name: 'ItemMusic',
    component: () => import(/* webpackChunkName: "itemMusic" */ '../views/ItemMusic.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/infoUser',
    name: 'InfoUser',
    // 独立路由守卫
    beforeEnter:(to,from,next) => {
      if(store.state.isLogin){
        next()
      }else{
        next('/login')
      } 
    },
    component: () => import(/* webpackChunkName: "infoUser" */ '../views/InfoUser.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 全局路由守卫
router.beforeEach((to,from) => {
  // console.log("查看路由的to属性---",to);
  if(to.path == '/login'){
    store.state.isFooterMusic = false
  }else{
    store.state.isFooterMusic = true
  }
})

export default router
