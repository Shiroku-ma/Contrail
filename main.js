// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

var force_quit = false;

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

  // Continue to handle mainWindow "close" event here
  mainWindow.on('close', function(e){
    if(!force_quit){
        e.preventDefault();
        mainWindow.hide();
    }
  });

  // You can use 'before-quit' instead of (or with) the close event
  app.on('before-quit', function (e) {
      // Handle menu-item or keyboard shortcut quit here
      force_quit = true;
  });

  app.on('activate', function(){
      mainWindow.show();
  });

  //メニューバーを非表示(windows)
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
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', function () {
  // This is a good place to add tests insuring the app is still
  // responsive and all windows are closed.
  mainWindow = null;
});

app.on('ready', function(){
  createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.