import Router from "vue-router";
import Vue from "vue";

import Home from "@/views/Home.vue";
import AddFile from "@/views/AddFile.vue";
import ShowResult from "@/views/ShowResult.vue";

Vue.use(Router);

export default new Router({
  // mode: "hash",
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/addFile",
      component: AddFile
    },
    {
      path: "/showResult",
      component: ShowResult
    }
  ]
});