import { ipcMain } from "electron";
import { WitchlyDesktopInstance, assetsFolder } from "..";
import { getUserInfo, login } from "./login";
import path from "path";
import { getData, setData } from "../utils/data";

export function loadIpcHandlers(i: WitchlyDesktopInstance) {
    ipcMain.on('login', async () => {
        login((status, userId) => {
            if (status === 'linkOpened') setTimeout(() => {
                i.window.webContents.send('loginAvailable');
            }, 2500)
            else if (status === 'success') {
                i.window.loadFile(path.join(assetsFolder, './pages/main.html'));
                i.loadSdk()
                i.sdk?.setAppUserId(userId!);
            }
            else if (status === 'failed') i.window.webContents.send('loginAvailable');
        });
    })

    ipcMain.on('logout', () => {
        i.window.loadFile(path.join(assetsFolder, './pages/login.html'));
        setData({
            userId: undefined,
            token: undefined,
            earningEnabled: getData().earningEnabled
        })
    })

    ipcMain.on('requestData', async () => {
        if (i.window.isMinimized() || i.isHidden) return;

        const userInfo = await getUserInfo();
        i.window.webContents.send('data', userInfo);
    })
}