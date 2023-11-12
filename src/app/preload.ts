import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('channel', {
    send: (channel: string, ...args: any) => ipcRenderer.send(channel, ...args),
    on: (channel: string, listener: any) => ipcRenderer.on(channel, listener)
})