import { BrowserWindow, ipcMain } from "electron";
import path from "path";

export async function getConsent() {
    return new Promise<boolean>(resolve => {
        const window = new BrowserWindow({
            autoHideMenuBar: true,
            title: 'Witchly AFK App - Consent',
            darkTheme: true,
            icon: path.join(__dirname, '../icon.png'),
            webPreferences: {
                preload: path.join(__dirname, 'app/preload.js')
            },
            width: 750,
            height: 520,
            resizable: false
        });

        const resolveStatus = (status: boolean) => {
            ipcMain.removeAllListeners();
            window.close();

            resolve(status);
        }
    
        ipcMain.once('accepted', () => resolveStatus(true));
        ipcMain.once('declined', () => resolveStatus(false));
    
        window.loadFile(path.join(__dirname, '../assets/pages/consent.html'))
    })
}