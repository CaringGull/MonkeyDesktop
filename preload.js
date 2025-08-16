const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("monkeyAPI", {
  setHover: (isHovering) => ipcRenderer.send("monkey:hover", isHovering),
  resizeToSprite: (width, height) => ipcRenderer.send("monkey:resizeToSprite", width, height)
});




