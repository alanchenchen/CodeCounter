/**
 * @module 读取文件的代码总行数、空白行数和注释行数,自动处理注释规则为空的情况
 * @param {String} file required 读取的文件String
 * @param {Object} rule required 读取的文件注释规则
 * @returns {Object}  返回一个包含代码总行数，空白行数，注释行数和具体代码的对象
 */

export const lineCounter = (file, rule) => {
    const removeBlankLine = file.split('\n').map((a,b) => {
        const line = b+1
        const data = a
        return {line,data}
    })

    const blankLine = removeBlankLine.filter(a => {
        return a.data.trim() == ''
    }).map(b => ({line:b.line}))

    let enableMultipleComment = false

    const getComment = (multipleRule=undefined, singleRule=undefined) => {
        const comment = removeBlankLine.map((a,b) => {
            const current = a.data.trim()
            const value = {line: a.line}
            const trigger = Boolean(enableMultipleComment) == true

            //单行注释
            if(Boolean(singleRule) && current.startsWith(singleRule)) {
                return {...value, flag: singleRule}
            }
            const flag = multipleRule.start + multipleRule.end
            if(Boolean(multipleRule.start) && Boolean(multipleRule.start)) {
                //多行注释写在一行
                if(current.startsWith(multipleRule.start) && current.endsWith(multipleRule.end)) {
                    return {...value, flag}
                }
                //多行注释写在多行
                else if(current.startsWith(multipleRule.start) && !current.endsWith(multipleRule.end)) {
                    enableMultipleComment = true //开启多行注释
                    return {...value, flag}
                }
                else if(current.startsWith(multipleRule.end)) {
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
        const comment = getComment(item.multiple, item.single)
        return [...total, ...comment]
    },[]).sort((a,b) => a.line-b.line)
    
    return {
        totalLineNum:  removeBlankLine.length,
        commentLineNum: commentLine.length,
        blankLineNum: blankLine.length,
        blankLineCode: blankLine,
        commentLineCode: commentLine
    }
}
