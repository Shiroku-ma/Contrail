// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 860,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setMenuBarVisibility(false)

  ipcMain.handle("clip_onclick", async (event, arg) => {
			  if (arg) {
          if (process.platform === "darwin") {
            app.dock.hide()
          }
          mainWindow.setAlwaysOnTop(true, "screen-saver")
          mainWindow.setVisibleOnAllWorkspaces(true)
        } else {
          if (process.platform === "darwin") {
            app.dock.show()
          }
          mainWindow.setAlwaysOnTop(false, "screen-saver")
          mainWindow.setVisibleOnAllWorkspaces(false)
        }
        mainWindow.show()
        mainWindow.focus()
        return
  })

  ipcMain.handle("translucent_window", async (event, arg) => {
    mainWindow.setOpacity(arg)
    return
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.