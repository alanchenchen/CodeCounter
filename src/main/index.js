const { app, BrowserWindow, Menu } = require('electron')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

//确保app只有一个实例运行
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    //当前窗口的title只能从index.ejs里改变title标签
    icon: 'build/icons/icon.ico', //注意路径！当前窗口的icon
    titleBarStyle: 'hiddenInset',
    width: 320,
    height: 550,
    show: false,
    frame: false,
    resizable: false
  })
  mainWindow.loadURL(winURL)
  
  //主窗口创建和关闭
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  
  mainWindow.once('focus', () => mainWindow.flashFrame(false))

  mainWindow.on('closed', (event) => {
    mainWindow = null
  })
}

//设置程序的任务栏列表
app.setUserTasks([])

//主进程加载和关闭
app.on('ready', () => {
  createWindow()
  Menu.setApplicationMenu(null) //禁用菜单栏
  const menu = new Menu()
  menu.closePopup([mainWindow]) //禁用上下文菜单
})

app.on('window-all-closed', (event) => {
  event.preventDefault()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
