const fs = require('fs')
const path = require('path')
const queryFile = require('./queryFile') //获取指定路径下的所有文件路径(过滤掉文件夹路径)
const lineCounter = require('./lineCounter').lineCounter //获取对应文件的行数、注释行数和空格行数
const defaultRule = require('./defaultRule') //预配置的默认文件注释规则


/**
 * @module 处理代码读取和文件读取的主要逻辑模块
 * @param  {Object} fileList required 读取文件和文件夹的对象，具有两个key => file和dictionary，均为String类型
 * @param  {Array} excludsion required 需要过滤文件夹的数组，支持文件名，文件夹名和文件后缀名(一定要加上点)
 * @param  {Object} rule required 自定义注释规则的对象，key是后缀名(不带点)，value是数组。具体结构见defaultRule模块
 * @param  {Function} cb 回调函数，返回两个参数，res表示所有文件结果的数组，msg是总结文本
 */

export default (fileList, excludsion, rule, cb) => {
    const file = fileList && fileList.file //用户配置文件的路径
    const dictionary = fileList && fileList.dictionary //用户配置文件夹的路径
    const exclude = excludsion || [] //用户配置过滤文件夹的文件(夹)名和后缀名
    const commentRule = rule //用户配置文件的注释规则
     //目标文件路径
     const filePath = file && path.resolve(__dirname, file)
    //目标文件夹路径
    const filter = ['node_modules', '.git', ...exclude] //默认过滤node_modules和.git文件夹
    const dictionaryPath = dictionary && queryFile(path.resolve(__dirname, dictionary),filter) 
    
    const AllPromise = []
    const BinaryType = ['jpg', 'png', 'jpeg', 'exe', 'pptx', 'ppt', 'docx', 'doc', 'xlsx', 'xls', 'pdf']
    
    const fsHanlder = fsPath => { //resolve返回type,file和readLine
        return new Promise((resolve,reject) => {
            fs.readFile(fsPath, 'utf-8', (err, buf) => {
                if(err) {
                    throw new Error(err)
                    reject(err)
                }
                const extName = path.extname(fsPath).substr(1).toLowerCase()
                //读取规则优先选择customed配置，然后是default配置，如果都没，则为空
                const relativeRule = (commentRule && commentRule[extName]) || defaultRule[extName] || []
                const type = BinaryType.includes(extName) ?'Binary' :'Code'
                const readeLine = type=='Binary'
                                    ?null
                                    :lineCounter(buf, relativeRule)
                const data = {
                    file: fsPath,
                    lineCounter: readeLine
                }
                resolve({type, data})
            })
        })
    }

    //将所有异步操作放入promise，然后用Promise.all并行读取
    if(Boolean(filePath)) {
        const promise = fsHanlder(filePath)
        AllPromise.push(promise) 
    }
    if(Boolean(dictionaryPath)) {
        dictionaryPath.forEach(fileName => {
            const promise = fsHanlder(fileName)
            AllPromise.push(promise) 
        })
    }


    //并行运行，减少异步获取文件读取行数的时间
    Promise.all(AllPromise).then(res => {
        const countTime = new Date().toLocaleString()
        const fileListLength = res.length
    
        const codeFile = res.filter(a => a.data.lineCounter !=null)
        const totalLine = codeFile.reduce((total,a) => {
            return total+a.data.lineCounter.totalLineNum
        },0)
        const blankLine = codeFile.reduce((total,a) => {
            return total+a.data.lineCounter.blankLineNum
        },0)
        const commentLine = codeFile.reduce((total,a) => {
            return total+a.data.lineCounter.commentLineNum
        },0)

        const list = `${(file || '')}   ${(dictionary || '')}`
        const msg = [
            ` 统计的目录：${list}`,
            ` 读取文件总数： ${fileListLength}`,
            ` 读取代码文件总数： ${codeFile.length}`,
            ` 代码总行数： ${totalLine}`,
            ` 代码总注释行数： ${commentLine}`,
            ` 代码总空格数： ${blankLine}`,
            ` 统计时间： ${countTime}`
        ]

        cb && cb(res, msg)
    })
}