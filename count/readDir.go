package count

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// 读取文件目录下的所有文件(夹)路径，并根据exclude过滤
//
// path：完整的os路径，filepath包拼接
//
// exclude：文件(夹)basename、文件后缀名的列表，例 []string{ "count", "count.go", ".go" }
func ReadDirTree(path string, exclude []string) ([]string, error) {
	var readDirErr error
	filesList := make([]string, 0)
	rootFs := os.DirFS(path)

	walkErr := fs.WalkDir(rootFs, ".", func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return fs.SkipDir
		}

		basename := d.Name()
		extname := filepath.Ext(basename)

		hasInclueds := stringSome(exclude, func(v string) bool {
			return strings.Compare(v, basename) == 0 || (!d.IsDir() && strings.Compare(v, extname) == 0)
		})
		// fmt.Printf("basename: %v, extname: %v, hasInclueds: %v\n", basename, extname, hasInclueds)

		// 如果被exclude匹配到文件(夹)名或文件后缀名，则跳过
		if hasInclueds {
			if d.IsDir() {
				return fs.SkipDir
			} else {
				return nil
			}
		}

		// 如果匹配到非exclude的文件名，append
		if !d.IsDir() {
			fullPath := filepath.Join(path, p)
			filesList = append(filesList, fullPath)
		}

		return nil
	})

	if walkErr != nil {
		readDirErr = walkErr
	}
	return filesList, readDirErr
}
