/**
 * @module 读取文件的代码总行数、空白行数和注释行数,自动处理注释规则为空的情况
 * @param {String} file required 读取的文件String
 * @param {Array} rule required 读取的文件注释规则，数组项可选包含row和block的key值，row必须是字符串，block必须是包含start和end两个key的对象，block和row可选。
 * @returns {Object}  返回一个包含代码总行数，空白行数，注释行数和具体代码的对象
 */

export const lineCounter = (file, rule) => {
    // 去除换行符返回的有效字符串数组
    const totalLine = file.split('\n').map((a,b) => {
        const line = b+1
        const data = a
        return {line,data}
    })

    // 空格符数组
    const blankLine = totalLine.filter(a => {
        return a.data.trim() == ''
    }).map(b => ({line:b.line}))

    /**
     * @function getComment
     * @description 读取一种规则下的注释信息
     * @param {Array} block 必须包含start(块注释起始)和end(块注释结束)两个值 
     * @param {String} row 行内注释标识符
     * @returns {Array} 返回一个数组，当前规则下文件的注释信息，数组项包含flag(注释标识符)和line(行号)两个值
     */
    const getComment = (block=undefined, row=undefined) => {
        let enableMultipleComment = false
        const comment = totalLine.map( a => {
            const current = a.data.trim()
            const value = {line: a.line}
            const trigger = Boolean(enableMultipleComment)

            //单行注释
            if(Boolean(row) && current.startsWith(row)) {
                return {...value, flag: row}
            }
            const flag = block.start + block.end
            if(Boolean(block.start) && Boolean(block.end)) {
                //多行注释写在一行
                if(current.startsWith(block.start) && current.endsWith(block.end)) {
                    return {...value, flag}
                }
                //多行注释写在多行
                else if(current.startsWith(block.start) && !current.endsWith(block.end)) {
                    enableMultipleComment = true //开启多行注释
                    return {...value, flag}
                }
                else if(current.endsWith(block.end)) {
                    enableMultipleComment = false //关闭多行注释
                    return {...value, flag}
                } 
                else if(trigger) { //多行注释起始注释和结束注释之间的内容
                    return {...value, flag}
                }
            }
        }).filter(a => a!=undefined)
        return comment
    }
    //一个文件中多种注释循环提取,然后将结果按照行号升序展示
    let commentLine = rule.reduce((total,item) => {
        const comment = getComment(item.block, item.row)
        return [...total, ...comment]
    },[]).sort((a,b) => a.line-b.line)
    
    return {
        totalLineNum:  totalLine.length,
        commentLineNum: commentLine.length,
        blankLineNum: blankLine.length,
        totalLineCode: totalLine,
        blankLineCode: blankLine,
        commentLineCode: commentLine
    }
}
