const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')
const Store = require('electron-store')

const tangerinoService = require('./services/tangerinoService')

let tray = null
const store = new Store();
const storedSettings = store.get('settings')

const createTray = () => {
  tray = new Tray('./assets/images/tangerine-filled.ico')
  tray.setToolTip('AppName')
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

  settingsWindow.on("close", (e) => {
    app.relaunch()
    app.exit()
  })
}

const createMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Open settings',
      click() {
        createSettingsWindow()
      }
    },
    {
      label: 'Quit',
      click() {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(menu)
}

app.whenReady().then(() => {
  createTray()
  createMenu()

  if (!storedSettings) createSettingsWindow()

  tangerinoService.clockIsPunched().then(console.log)
})

app.on('window-all-closed', (e) => {
  e.preventDefault()
})
