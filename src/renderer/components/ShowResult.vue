<template>
    <div class="result">
        <ul>
            <li
                v-for="(item, i) of msg"
                :key="i"
                class="message"
            >
                <Icon type="checkmark-circled" color="#19be6b" />
                <span :title="item">{{item}}</span>
            </li>
        </ul>
        <Button 
            class="save_btn"
            type="success"
            @click="save">保存统计到本地</Button>
    </div>
</template>

<script>
    import writeFile from '@/utils/writeFile'
    export default {
        data() {
            return {
                msg: []
            }
        },
        created() {
            const msg = JSON.parse(window.sessionStorage.getItem('msg'))
            this.msg = msg
        },
        methods: {
            save() {
                const msg = this.msg.reduce((total, a) => {
                    return `${total + a} \r\n\r\n`
                }, '\r\n')

                const result = JSON.parse(window.sessionStorage.getItem('result'))
                const text = result.reduce((total, a) => {
                    const hasLineCounter = Boolean(a.data.lineCounter)
                    const path = a.data.file
                    const type = a.type
                    const totalNum = hasLineCounter && a.data.lineCounter.totalLineNum
                    const comment = hasLineCounter && a.data.lineCounter.commentLineNum
                    const blank = hasLineCounter && a.data.lineCounter.blankLineNum

                    const t = hasLineCounter == true
                            ? `文件：${path}   类型：${type}    总共代码(${totalNum})行   总共注释(${comment})行   总共空格(${blank})行`
                            : `文件：${path}   类型：${type}`
                    return `${total}${t} \r\n\r\n`
                }, '')
                
                //最终写入的string
                const str = `${msg} \r\n\r\n\r\n ${text}`

                //弹窗让用户选择路径保存文件
                const dialog = this.$electron.remote.dialog
                const defaultName = `codeCount  ${new Date().toLocaleString().split(' ')[0]}`.replace(/\//g, '-')
                const options = {
                    title: '请选择保存统计文件的路径',
                    filters: [{name: 'Text文本', extensions: ['txt']}],
                    defaultPath : defaultName
                }
                dialog.showSaveDialog(options, (filename) => {
                    writeFile(filename, str)
                        .then(res => {
                            //任务栏窗口闪烁提示用户
                            const currentWindow = this.$electron.remote.getCurrentWindow()
                            currentWindow.flashFrame(true)
                            this.$Modal.success({
                                title: '提示',
                                content: '统计txt文件已成功保存！'
                            })
                        })
                })
            }
        }
    }
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
        font-family: '微软雅黑';
    }
    .save_btn {
        display: block;
        margin: 180px auto 0;
    }
</style>