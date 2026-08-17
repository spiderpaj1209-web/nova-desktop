const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('novaUpdates', {
  install: () => ipcRenderer.send('nova-install-update'),
  onStatus: callback => ipcRenderer.on('nova-update-status', (_event, status) => callback(status))
});
window.addEventListener('DOMContentLoaded', () => {
  for (const file of ['nova-chat.js', 'nova-updates.js']) {
    const script = document.createElement('script');
    script.src = file;
    document.head.appendChild(script);
  }
});
