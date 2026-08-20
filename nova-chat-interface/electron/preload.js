const { contextBridge } = require('electron');

// Exemple de pont sécurisé vers le renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
