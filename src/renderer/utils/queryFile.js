const fs = require('fs')
const path = require('path')

/**
 * @module 读取指定路径下所有的文件路径
 * @param {String} path 指定读取的文件夹路径
 * @param {Array} exclude 指定过滤的文件名称或文件夹名称或后缀名的数组
 * @returns {Array} 返回一个读取到所有文件绝对路径的数组
 */

//同步获取指定路径下的所有文件名，自动跳过文件夹并递归获取,需要用回调函数获取filename,并过滤指定文件夹
//PathName-绝对路径  exclude-过滤文件,文件夹或后缀名  callback-回调函数，参数为读取到的单个文件绝对路径
function getFile(PathName, exclude=null, callback) {
    let files = fs.readdirSync(PathName)
    files.forEach(file => {
        const fileName = path.join(PathName, file)
        const extName = path.extname(fileName)
        const stats = fs.statSync(fileName)
        //获取的是文件
        if(exclude && exclude.some(a => a == file || a == extName)) return ; //过滤掉exclude的文件夹或文件
        if (stats.isFile()) {
            callback && callback(fileName)
        }
        //获取的是文件夹就递归查询
        else if (stats.isDirectory()) {
            getFile(fileName, exclude, callback)
        }
    })
}

const fileList = (path, exclude) => {
    let fl = []
    getFile(path, exclude, fileName => fl.push(fileName))
    return fl
}

module.exports = fileList