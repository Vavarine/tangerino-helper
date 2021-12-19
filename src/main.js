const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')

let tray = null

const createTray = () => {
  tray = new Tray('./assets/images/tangerine-filled.ico')
  tray.setToolTip('AppName')
}

const createMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(menu)
}

const createSettingsWindow = () => {
  const settingsWindow = new BrowserWindow({
    width: 540,
    minWidth: 540,
    height: 500,
    minHeight: 500,
    darkTheme: true,

    title: "Configurações",
    icon: './assets/images/tangerine-filled.ico',

    webPreferences: {
      preload: path.join(__dirname, 'views', 'Settings', "preload.js")
    }
  })

  settingsWindow.loadFile('src/views/Settings/index.html')
}

app.whenReady().then(() => {
  createTray()
  createMenu()
  createSettingsWindow()

  // setTi 
})
