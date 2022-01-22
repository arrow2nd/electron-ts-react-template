import path from 'path'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'

let win: BrowserWindow

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    webPreferences: {
      // devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./build/index.html')
  // win.webContents.openDevTools()

  // 表示可能になったら表示する
  win.once('ready-to-show', () => win.show())

  // メニューを無効化
  Menu.setApplicationMenu(null)

  // 多重起動を防止
  const doubleboot = app.requestSingleInstanceLock()
  if (!doubleboot) {
    app.quit()
  }
}

// 初期化できたらウィンドウを作成
app.whenReady().then(() => {
  createWindow()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//---------------------------------------------------

// アプリケーションを終了
ipcMain.on('win-close', () => app.quit())

// ウィンドウを最小化
ipcMain.on('win-minimize', () => win.minimize())
