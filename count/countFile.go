package count

import (
	"os"
	"path/filepath"
	"sync"
	"unicode/utf8"
)

type FileCodeCounter struct {
	FilePath string      `json:"filePath"`
	FileType string      `json:"fileType"`
	Data     LineCounter `json:"data,omitempty"`
}

// 读取单个文件，计算代码空白行、注释行
func readCodeLineByFile(path string, commentRule []CommentRule, msgChan chan<- FileCodeCounter, wg *sync.WaitGroup) {
	defer wg.Done()
	// 解析代码文件中的空白行、注释行
	codeCounter := FileCodeCounter{
		path,
		"",
		LineCounter{},
	}
	file, _ := os.ReadFile(path)
	valid := utf8.Valid(file)
	if valid {
		codeCounter.FileType = "code"
		codeCounter.Data = countCodeWithCache(string(file), commentRule)
	} else {
		codeCounter.FileType = "binary"
	}
	msgChan <- codeCounter

	// fmt.Printf("file: \u001b[1;36m%v\u001b[0m, BlankLineNum: %v, CommentLineNum: %v, TotalLineNum: %v\n", filepath.Base(path), lineCounter.BlankLineNum, lineCounter.CommentLineNum, lineCounter.TotalLineNum)
	// for _, line := range lineCounter.TotalLine {
	// 	fmt.Printf("line: %v, flag: %q, code: %q\n", line.LineNO, line.CommentFlag, line.Code)
	// }
}

// 读取dir下所有文件，计算代码空白行、注释行,返回一个接收channel，可以多次读取，当所有文件都被计算完成后，channel会自动关闭
func ReadCodeLinesByDirFiles(rootDir string, exclude []string, fileRules map[string][]CommentRule) (<-chan FileCodeCounter, error) {
	files, err := ReadDirTree(rootDir, exclude)
	wg := new(sync.WaitGroup)
	msgChan := make(chan FileCodeCounter, len(files))
	if err != nil {
		return msgChan, err
	}

	for _, file := range files {
		extname := filepath.Ext(file)
		if len(extname) > 1 {
			extname = extname[1:]
		}
		rule := fileRules[extname]

		wg.Add(1)
		go readCodeLineByFile(file, rule, msgChan, wg)
	}

	// 文件一边count，一边读取chanel
	// 完全的channel pipe，channel带缓冲，不会阻塞多个go routine计算
	go func() {
		wg.Wait()
		// 必须关闭，因为range仅当close chan才跳出
		close(msgChan)
	}()
	return msgChan, nil
}
