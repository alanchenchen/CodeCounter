import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import('@/page/Home')
        },
        {
            path: '/addFile',
            component: () => import('@/page/AddFile')
        },
        {
            path: '/showResult',
            component: () => import('@/page/ShowResult')
        }
    ]
})