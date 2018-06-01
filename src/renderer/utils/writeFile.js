const fs = require('fs')

/**
 * @module 写入文件的promise模块
 * @param {String | Buffer} file 写入的文件，buffer或string类型
 * @param {String} path 写入文件的绝对路径,带后缀名
 * @returns {Promise} 返回一个promise，成功写入resolve，失败则reject
 */
export default (path, file) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(path, file, err => {
            if(err) reject(err)
            resolve()
        })
    })
}
