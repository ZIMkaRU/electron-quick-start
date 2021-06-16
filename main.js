// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow (layout = 'index.html', opts) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    ...opts
  })

  // and load the index.html of the app.
  win.loadFile(layout)

  // Open the DevTools.
  // win.webContents.openDevTools()

  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('[createWindow-call]')

  const mainWindow = createWindow()

  mainWindow.on('error', (e) => {
    console.error('[mainWindow-error]:', e)
  })
  mainWindow.once('show', () => {
    console.log('[show-event]')
  })
  mainWindow.once('ready-to-show', () => {
    console.log('[ready-to-show]')

    const childWindow = createWindow(
      'app-init.html',
      {
        width: 400,
        height: 400,
        frame: false,
        resizable: false,
        parent: mainWindow
      }
    )
    childWindow.once('ready-to-show', () => {
      childWindow.show()
    })

    setTimeout(() => {
      console.log('[show-call]')

      childWindow.hide()
      mainWindow.show()
    }, 10000)
  })
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
