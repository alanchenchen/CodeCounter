<template>
  <div id="app">
    <div class="nav_bar">
      <span style="--wails-draggable:drag" class="title">{{ title }}</span>
      <Icon
        v-if="!isHome"
        type="android-arrow-back"
        size="30"
        class="nav_btn left"
        title="返回上一页"
        @click="goBack"
      />
      <Dropdown trigger="click" @on-click="custom" class="nav_btn right_3">
        <Icon
          type="android-color-palette"
          size="18"
          color="#2d8cf0"
          title="配置窗口动画"
        />
        <DropdownMenu slot="list">
          <DropdownItem name="scale">缩放切换</DropdownItem>
          <DropdownItem name="translate">位移切换</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Icon
        type="minus"
        size="18"
        color="#2d8cf0"
        class="nav_btn right_2"
        title="隐藏到任务栏"
        @click="minimize"
      />
      <Icon
        type="android-close"
        size="20"
        color="#ed3f14"
        class="nav_btn right_1"
        title="退出程序"
        @click="exit"
      />
    </div>
    <transition :name="animateClass">
      <router-view class="view" />
    </transition>
  </div>
</template>

<script>
import * as Native from "./wailsjs/go/main/App";
import { WindowMinimise } from "./wailsjs/runtime/runtime";

export default {
  name: "App",
  data() {
    return {
      title: "首页",
      isHome: true,
      animateClass: "scale",
    };
  },
  watch: {
    $route(to, from) {
      const map = {
        "/": "首页",
        "/addFile": "添加文件夹",
        "/showResult": "统计显示",
      };
      this.title = map[to.path];
      this.isHome = this.title == "首页" ? true : false;
    },
  },
  mounted() {
    document.body.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
    document.body.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    document.body.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  },
  methods: {
    //后退
    goBack() {
      this.$router.back();
    },
    //配置窗口动画
    custom(name) {
      this.animateClass = name;
    },
    //最小化
    minimize() {
      WindowMinimise();
    },
    //退出程序
    exit() {
      this.$Modal.confirm({
        title: "提示",
        content: "确定关闭程序吗？",
        onOk: () => {
          Native.Quit();
        },
      });
    },
  },
};
</script>

<style>
body {
  overscroll-behavior: none;
}
</style>
<style scoped>
/* CSS */
#app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.view {
  position: absolute;
  width: 100%;
  height: calc(100vh - 40px);
  box-sizing: border-box;
  font-family: "微软雅黑";
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease-in-out;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
.translate-enter-active,
.translate-leave-active {
  transition: all 0.4s ease-in-out;
}
.translate-enter,
.translate-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.nav_bar {
  position: relative;
  width: 100%;
  z-index: 999;
}
.title {
  display: block;
  cursor: -webkit-grab;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-family: "微软雅黑";
  text-align: center;
}
.nav_btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.left {
  left: 10px;
}
.right_2 {
  right: 40px;
}
.right_1 {
  right: 10px;
}
.right_3 {
  right: 70px;
}
</style> 
