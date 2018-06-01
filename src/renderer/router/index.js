import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import('@/components/Home')
        },
        {
            path: '/addFile',
            component: () => import('@/components/AddFile')
        },
        {
            path: '/showResult',
            component: () => import('@/components/ShowResult')
        }
    ]
})