# Code Counter

> An application to count code in electron-vue

> version:  1.0.0

> Author:  Alan Chen

> Technology stack:  Vue + Electron + Webpack + Node + iview

### Features
 * 采用electron框架生成exe可执行文件，方便离线使用。软件打包后安装包30多M，解压缩133M左右(集成chromium没办法...)
 * node异步io操作很快，多个文件解析采用了promise.all来并行运行，不是async的串行
 * 支持拖拽文件或文件夹读取文件，自定义统计哪个文件夹下代码数量
 * 支持文件(夹)过滤，支持对应后缀名文件过滤
 * 支持对应后缀名文件添加自定义注释规则，目前只自带很小一部分代码的默认注释规则

![](./screenshot/screenshot1.png)
![](./screenshot/screenshot2.png)
![](./screenshot/screenshot3.png)

### Usage Help
 1. 拖拽即可读取文件(夹)，目前仅支持同时统计一个文件和一个文件夹，再次拖拽会覆盖
 2. 过滤功能只对文件夹生效，在弹窗中按enter添加，注意添加后缀名必须带上点
 3. 注释规则文件名不需要带点，规则分为多行注释和单行注释，非必填，一个后缀名文件可以添加多个规则，但不可重复。
 4. 软件默认过滤`node_modules`和`.git`两个文件夹。
 5. 软件默认提供js、html、css、jsx、java和vue等文件的注释规则
 6. 读取代码的原理其实是将目标文件的buffer转换成utf-8的string，所以只支持uft-8编码的文件，默认不支持图片和office所有文件！也不要读取非utf-8的文件，否则统计结果不可信。大多数code的编码格式是utf-8。

### Download

* [安装包版本](https://pan.baidu.com/s/1s-7ys5bYiYvApsj6g_i0uA)   密码: t4gy 
* [绿色版本](https://pan.baidu.com/s/1HZtqWzXlxCkJzUCEju1g7w)    密码: 3yhj
 
### Dictionary Tree
``` bash
    ├─.electron-vue     electron-vue的webpack配置文件
    ├─build             
    │  ├─icons          electron-builder打包的icon
    ├─dist
    │  ├─electron
    │  │  ├─fonts
    │  │  └─imgs
    │  └─web
    ├─screenshot        
    ├─src
    │  ├─main           主进程
    │  └─renderer       渲染进程
    │      ├─assets
    │      ├─common     
    │      ├─components     页面组件
    │      ├─router
    │      └─utils      主要的node模块方法
    └─static
```

### 踩坑记录
 1. electron本身下载必须翻墙！使用cnpm等着包出错吧~
 2. electron-builder 嗯...不用说了，翻墙吧
 3. 为了阻止程序多开，也是找了好久才找到makeSingleInstance这个api...
 4. 无边框窗口也是坑，默认的title右键菜单隐藏不了...嗯，就这样了
 5. 窗口的title只能从index.html里改变title标签...文档哪里说了？
 6. 感慨一下，还是原生node用的舒服，不用管什么electron重新编译一把...就这么多吧

### Build Setup

``` bash
# install dependencies
npm install or yarn

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

```
### 

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
