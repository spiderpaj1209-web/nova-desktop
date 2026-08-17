const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { LocalBrain } = require('./local-brain.cjs');

let brain;

async function createWindow() {
  brain = new LocalBrain({ userDataPath: app.getPath('userData') });
  await brain.start();

  ipcMain.handle('nova:brain:status', () => brain.status());
  ipcMain.handle('nova:brain:start', () => brain.start());
  ipcMain.handle('nova:brain:stop', () => brain.stop());
  ipcMain.handle('nova:brain:ask', (_event, message) => brain.ask(message));

  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#071014',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  win.loadFile(path.join(__dirname, '../src/index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => { void brain?.stop(); });
