const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  translucent_window: (opacity) => ipcRenderer.invoke('translucent_window', opacity),
  clip_onclick: (clip) => ipcRenderer.invoke('clip_onclick', clip)
});