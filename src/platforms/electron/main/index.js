import { app, BrowserWindow } from 'electron'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow(){
	mainWindow = new BrowserWindow({
	  	height: 563,
	  	useContentSize: true,
	  	titleBarStyle : 'hidden',
	  	width: 1000
	})
	mainWindow.loadURL(winURL)
	mainWindow.on('closed', () => {
	  	mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('activate', () => {
    if (mainWindow === null) {
  		createWindow()
    }
})
