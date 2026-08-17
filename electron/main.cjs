const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#071014',
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.cjs') }
  });
  win.loadFile(path.join(__dirname, '../src/index.html'));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
