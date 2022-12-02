package main

import (
	"code-counter/count"
	"context"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App application struct
type App struct {
	ctx context.Context
}

type CustomCommentRules map[string][]count.CommentRule

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// ---- app lifeCycle ----

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (a *App) domReady(ctx context.Context) {
	// Add your action here
	runtime.WindowShow(a.ctx)
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue,
// false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// ---- app native go methods bindings to js ----

// Quit will quit the application
func (a *App) Quit() {
	runtime.Quit(a.ctx)
}

// ReadCodeLinesByDirFiles calculate code counter from dir, return counter data
func (a *App) ReadCodeLinesByDirFiles(dir string, exclude []string, customRules CustomCommentRules) ([]count.FileCodeCounter, error) {
	// 合并customRules到count.DefaultRuleConfig，customRules优先级更高
	// 必须初始化一个map，而不是直接赋值count.DefaultRuleConfig
	// map是指针传递，这样会改变count.DefaultRuleConfig原值
	fileRules := make(CustomCommentRules)
	for k, v := range count.DefaultRuleConfig {
		fileRules[k] = v
	}
	for k, v := range customRules {
		fileRules[k] = v
	}
	// 合并exclude到count.ExcludePaths
	excludeList := append(count.ExcludePaths, exclude...)

	lineCounters, err := count.ReadCodeLinesByDirFiles(dir, excludeList, fileRules)

	res := make([]count.FileCodeCounter, 0)
	for countData := range lineCounters {
		res = append(res, countData)
	}
	return res, err
}

// OpenDialog show a system dialog to choose a file directory
func (a *App) OpenDirectoryDialog(dialogOptions runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, dialogOptions)
}

// SaveFileDialog show a system dialog to choose a saving file path
func (a *App) SaveFileDialog(dialogOptions runtime.SaveDialogOptions) (string, error) {
	return runtime.SaveFileDialog(a.ctx, dialogOptions)
}

// WriteFile write string data to path
func (a *App) WriteFile(path string, data string) error {
	// 创建文件
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	// 写入buf到文件
	_, writeErr := file.Write([]byte(data))
	if writeErr != nil {
		return writeErr
	}
	return nil
}

// Extname return path ext name
func (a *App) Extname(path string) string {
	return filepath.Ext(path)
}
