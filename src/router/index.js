// 路由配置文件

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 导入一级路由
import Layout from '@/views/layout/index.vue' // 首页架子

// 导入二级路由
import Home from '@/views/layout/home.vue' // 首页
import Cart from '@/views/layout/cart.vue' // 购物车页
import Category from '@/views/layout/category.vue' // 分类页
import User from '@/views/layout/user.vue' // 用户页

// 导入一级路由(路由懒加载)
const Login = () => import('@/views/login/index.vue') // 登录页
const Pay = () => import('@/views/pay/index.vue') // 支付页
const Myorder = () => import('@/views/myorder/index.vue') // 订单页
const Prodetail = () => import('@/views/prodetail/index.vue') // 产品详情页
const Search = () => import('@/views/search/index.vue') // 搜索页
const SearchList = () => import('@/views/search/list.vue') // 搜索列表页

// 注册路由
Vue.use(VueRouter)

// 路由配置
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home', // 路由重定向
      children: [
        // 二级路由配置
        { path: '/home', component: Home },
        { path: '/cart', component: Cart },
        { path: '/category', component: Category },
        { path: '/user', component: User }
      ]
    },
    { path: '/login', component: Login },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: Myorder },
    { path: '/prodetail/:id', component: Prodetail },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList }
  ]
})

// 全局前置导航守卫
// 当用户进行路由跳转时,会被前置导航守卫所拦截,由前置导航守卫判断是否放行跳转
const authUrls = ['/pay', '/myorder'] // 需要鉴权的路由
router.beforeEach((to, from, next) => {
  // to 目标路由; from 当前路由; next 是否放行
  // next() 放行跳转; next(/路由); 拦截并跳转到配置的路由
  // 1.若目标路由不需要鉴权则直接放行
  if (!authUrls.includes(to.path)) return next()
  // 2.若目标路由需要鉴权则判断token状态
  const token = store.getters.token // 获取vuex中的token
  if (!token) return next('/login') // 若token为空,跳转到登录页
  next()
})

export default router
