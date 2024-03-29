const { app, BrowserWindow } = require('electron');
const path = require('path');
let mainWindow;

function createMainWindow() {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Glassmatrix',
    resizable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'src/favicon.ico'),
  });

  mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

  mainWindow.setMenu(null);
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    event.preventDefault();
    const popup = new BrowserWindow(options);
    event.newGuest = popup;

    popup.webContents.on('login', (event, request, authInfo, callback) => {
      event.preventDefault();
      callback('bluejay', 'bluejay');
    });

    popup.loadURL(url);
  });
  // Consola abierta
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
