import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

import iView from "iview";
import "iview/dist/styles/iview.css";
Vue.use(iView);

//路由跳转加入loadingbar全局提示
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");