export interface go {
  "main": {
    "App": {
		Extname(arg1:string):Promise<string>
		OpenDirectoryDialog(arg1:OpenDialogOptions):Promise<string|Error>
		Quit():Promise<void>
		ReadCodeLinesByDirFiles(arg1:string,arg2:Array<string>,arg3:CustomCommentRules):Promise<Array<FileCodeCounter>|Error>
		SaveFileDialog(arg1:SaveDialogOptions):Promise<string|Error>
		WriteFile(arg1:string,arg2:string):Promise<Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
