import Vue from 'vue'
import App from './App'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

//路由跳转加入loadingbar全局提示
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next()
})

router.afterEach( route => {
  iView.LoadingBar.finish()
}) 

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  router
}).$mount('#app')
