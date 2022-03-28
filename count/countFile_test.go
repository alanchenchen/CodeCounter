package count

import (
	"fmt"
	"path/filepath"
	"testing"
)

func BenchmarkCountFileByDir(b *testing.B) {
	for i := 0; i < b.N; i++ {
		// 读取dir下的文件信息
		exclude := []string{"go.mod", ".css", ".scss"}
		rootDir, _ := filepath.Abs("./")
		filesLineCode, err := ReadCodeLinesByDirFiles(rootDir, exclude, make(map[string][]CommentRule)
		if err != nil {
			fmt.Println(err)
		}
		for range filesLineCode {
			// fmt.Printf("chan len is %v,chan cap is %v, msg comment NO is %v.\n", len(msgChan), cap(msgChan), msg.CommentLineNum)
		}
	}
}
