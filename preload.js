const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  clip_onclick: (clip) => ipcRenderer.invoke('clip_onclick', clip)
});