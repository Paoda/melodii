require('dotenv').config();

const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600, frame: false, webPreferences: { webSecurity: false } }); //TODO: Please find a better solution for the love of god.

  if (process.env.NODE_ENV) win.loadURL(`http://localhost:${process.env.PORT}`);
  else win.loadFile('./build/index.html');

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
