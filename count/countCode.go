package count

import (
	"strings"
)

type lineCode struct {
	LineNO      int    `json:"lineNO"`
	Code        string `json:"code,omitempty"`
	CommentFlag string `json:"commentFlag,omitempty"`
}

type LineCounter struct {
	TotalLineNum   int        `json:"totalLineNum"`
	BlankLineNum   int        `json:"blankLineNum"`
	CommentLineNum int        `json:"commentLineNum"`
	TotalLine      []lineCode `json:"totalLineCode"`
	BlankLine      []lineCode `json:"blankLineCode"`
	CommentLine    []lineCode `json:"commentLineCode"`
}

// countCodeWithCache 通过读取string buffer，解析代码文件中的注释行、空白行,
// 必须保证s是utf-8编码
func countCodeWithCache(s string, rules []CommentRule) LineCounter {
	var totalLine, blankLine, commentLine []lineCode
	// 先去除换行符，拿到每行代码的切片
	OSFileEOL := "\n"
	lineWithoutEOL := strings.Split(s, OSFileEOL)
	// 对于同一行代码，不同注释规则是否开启多行注释，需要分开管理
	// 为了减少内存占用，只存储len(rules)长度/容量的切片
	enableMultipleComment := make([]bool, len(rules))

	for k, v := range lineWithoutEOL {
		commentFlag := ""
		lineNO := k + 1
		// 需要处理代码中的空格前后缀和CRLF模式下的换行符前后缀
		code := strings.Trim(v, "\r\t")

		// TODO:
		// 如果空白行在多行注释内，会被处理成空白行
		if strings.Compare(code, "") == 0 {
			blankLine = append(blankLine, lineCode{lineNO, code, commentFlag})
		}

		for i, rule := range rules {
			// 单行注释
			if strings.Compare(rule.row, "") != 0 &&
				strings.HasPrefix(code, rule.row) {
				commentFlag = rule.row
				commentLine = append(commentLine, lineCode{lineNO, code, commentFlag})
			}

			// 避免注释规则为空，若为空，则每行代码均被判断成注释
			if strings.Compare(rule.block.start, "") == 0 ||
				strings.Compare(rule.block.end, "") == 0 {
				continue
			}

			// 多行注释
			if strings.HasPrefix(code, rule.block.start) ||
				strings.HasSuffix(code, rule.block.end) ||
				enableMultipleComment[i] {
				commentFlag = rule.block.start + rule.block.end
				commentLine = append(commentLine, lineCode{lineNO, code, commentFlag})
			}

			// 多行注释写在多行
			if strings.HasPrefix(code, rule.block.start) &&
				!strings.HasSuffix(code, rule.block.end) {
				// 开启多行注释
				enableMultipleComment[i] = true
			} else if strings.HasSuffix(code, rule.block.end) {
				// 关闭多行注释
				enableMultipleComment[i] = false
			}
		}
		totalLine = append(totalLine, lineCode{lineNO, code, commentFlag})
	}

	return LineCounter{
		len(totalLine),
		len(blankLine),
		len(commentLine),
		totalLine,
		blankLine,
		commentLine,
	}
}
