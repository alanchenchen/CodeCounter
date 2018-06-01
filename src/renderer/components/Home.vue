<template>
  <div id="wrapper">
    <img class="logo" src="~@/assets/logo.png" />
    <h1 class="title">CodeCounter</h1>
    <p class="description">轻量级统计代码的工具</p>
    <Button icon="plus" @click="go">开始使用</Button>
      <p class="author">作者: 
        <Tooltip content="开源不易，支持作者其它项目，thanks">
          <div class="link" @click="open('https://github.com/alanchenchen')">
            <a>Alan Chen</a>
            <img src="~@/assets/github.png" />
          </div>
        </Tooltip>
      </p>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    methods: {
      go() {
        this.$router.push('/addFile')
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style lang="css" scoped>
#wrapper {
  padding: 50px 80px;
  text-align: center;
}
.logo {
  width: 100px;
  height: 80px;
}
.title {
  margin-top: 10px;
  font-style: italic;
  color: #777;
  font-size: 24px;
}
.description {
  margin-top: 20px;
  margin-bottom: 80px;
  color: #888;
}
.author {
  margin-top: 100px;
  font-size: 16px;
  color: #888;
  vertical-align: middle;
}
.link {
  cursor: pointer;
}
.link a {
  color: #5098ff;
}
.author img {
  margin-left: 5px;
  width: 25px;
  height: 25px;
  vertical-align: middle;
}
</style>
