const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('novaBrain', {
  status: () => ipcRenderer.invoke('nova:brain:status'),
  start: () => ipcRenderer.invoke('nova:brain:start'),
  stop: () => ipcRenderer.invoke('nova:brain:stop'),
  ask: (message) => ipcRenderer.invoke('nova:brain:ask', message)
});
