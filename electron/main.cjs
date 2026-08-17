const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
let win;
const sendUpdate = (state, detail = '') => { if (win && !win.isDestroyed()) win.webContents.send('nova-update-status', { state, detail }); };
function createWindow() {
  win = new BrowserWindow({ width: 1280, height: 820, minWidth: 900, minHeight: 620, backgroundColor: '#071014', webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.cjs') } });
  win.loadFile(path.join(__dirname, '../src/index.html'));
}
app.whenReady().then(() => {
  createWindow();
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdate('checking'));
  autoUpdater.on('update-available', info => sendUpdate('downloading', info.version));
  autoUpdater.on('download-progress', p => sendUpdate('downloading', `${Math.round(p.percent)} %`));
  autoUpdater.on('update-not-available', () => sendUpdate('current'));
  autoUpdater.on('update-downloaded', info => sendUpdate('ready', info.version));
  autoUpdater.on('error', error => sendUpdate('error', error.message));
  setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 5000);
});
ipcMain.on('nova-install-update', () => autoUpdater.quitAndInstall());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
