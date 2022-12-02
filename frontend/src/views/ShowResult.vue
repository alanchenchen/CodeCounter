<template>
  <div class="result">
    <ul>
      <li v-for="(item, i) of msg" :key="i" class="message">
        <Icon type="checkmark-circled" color="#19be6b" />
        <span :title="item">{{ item }}</span>
      </li>
    </ul>
    <Button
      class="save_btn"
      type="success"
      size="large"
      icon="ios-download-outline"
      @click="save"
      >保存到本地</Button
    >
  </div>
</template>

<script>
import * as Native from "../wailsjs/go/main/App";

export default {
  data() {
    return {
      msg: [],
    };
  },
  created() {
    const msg = JSON.parse(window.sessionStorage.getItem("msg"));
    this.msg = msg;
  },
  methods: {
    async save() {
      try {
        const msg = this.msg.reduce((total, a) => {
          return `${total + a} \r\n\r\n`;
        }, "\r\n");

        const result = JSON.parse(window.sessionStorage.getItem("result"));
        const text = result.reduce((total, a) => {
          const hasLineCounter = a.hasOwnProperty("data");
          const path = a.filePath;
          const type = a.fileType;
          const comment = hasLineCounter && a.data.commentLineNum;
          const blank = hasLineCounter && a.data.blankLineNum;
          const code = hasLineCounter && a.data.totalLineNum - comment - blank;

          const t =
            hasLineCounter == true
              ? `文件：${path}   类型：${type}    总共代码(${code})行   总共注释(${comment})行   总共空格(${blank})行`
              : `文件：${path}   类型：${type}`;
          return `${total}${t} \r\n\r\n`;
        }, "");

        //最终写入的string
        const str = `${msg} \r\n\r\n\r\n ${text}`;

        //弹窗让用户选择路径保存文件
        const defaultName = `codeCount  ${
          new Date().toLocaleString().split(" ")[0]
        }`.replace(/\//g, "-");
        const options = {
          Title: "请选择保存统计文件的路径",
          DefaultFilename: defaultName,
          Filters: [{ DisplayName: "Text (*.txt)", Pattern: "*.txt" }],
        };
        const filename = await Native.SaveFileDialog(options);
        if (filename) {
          await Native.WriteFile(filename, str);
          //任务栏窗口闪烁提示用户
          // const currentWindow = this.$electron.remote.getCurrentWindow();
          // currentWindow.flashFrame(true);
          this.$Modal.success({
            title: "提示",
            content: "txt文件已成功保存！",
          });
        } else {
          this.$Modal.warning({
            title: "提示",
            content: "txt文件已取消保存！",
          });
        }
      } catch (error) {
        this.$Modal.error({
          title: "提示",
          content: "txt文件保存失败！",
        });
        console.log(error);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.result {
  padding: 30px 10px 0;
}
.message {
  width: 290px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  list-style: none;
  font-size: 16px;
  color: #888;
  font-family: "微软雅黑";
}
.save_btn {
  display: block;
  margin: 180px auto 0;
}
</style>