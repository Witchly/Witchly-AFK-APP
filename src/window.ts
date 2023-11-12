import { BrowserWindow, app } from "electron";
import path from "path";
import { WitchlyDesktopInstance } from ".";
import { getData } from "./utils/data";
import wasOpenedAtLogin from "./utils/wasOpenedAtLogin";

export default function createWindow(instance: WitchlyDesktopInstance) {
    const window = new BrowserWindow({
        autoHideMenuBar: true,
        title: 'Witchly AFK App',
        darkTheme: true,
        icon: path.join(__dirname, '../icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'app/preload.js')
        },
        width: 350,
        height: 550,
        resizable: false
    });

    window.removeMenu();
    if (wasOpenedAtLogin()) {
        window.hide();
        instance.isHidden = true;
    }

    // If another instance of the app is opened, this window should be shown and the second instance will exit
    app.on('second-instance', () => {
        window.show();
        instance.isHidden = false;
    })

    app.on('before-quit', function () {
        instance.isQuitting = true;
    });
    window.on('close', (e) => {
        if (!instance.isQuitting) {
            e.preventDefault();
            window.hide();
            instance.isHidden = true;
            e.returnValue = false;
        }
    });

    const data = getData();
    if (data.token && data.userId) window.loadFile(path.join(__dirname, '../assets/pages/main.html'));
    else window.loadFile(path.join(__dirname, '../assets/pages/login.html'));

    return window;
}