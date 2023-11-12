import AutoLaunch from "auto-launch";
import { app } from "electron";
import { autoUpdater } from "electron-updater";
import { SdkInstance } from "./sdk";
import createTray from "./tray";
import { getData, hasConsented, setConsented } from "./utils/data";
import createWindow from "./window";
import { loadIpcHandlers } from "./app/ipc";
import { getConsent } from "./consent";
import path from "path";

export const SONIC_SDK_APP_ID = '82cde2c0-f4d6-478b-8ed6-34e4e5007b94';

// Finding assets folder so that whether the code is bundled or not does not affect path to assets folder
export const assetsFolder = path.join(__dirname, "../assets")

// Only one instance can run at once
if (!app.requestSingleInstanceLock()) app.quit();

if (app.isPackaged) {
    // App is running in production

    // Setup auto launching
    const autoLauncher = new AutoLaunch({
        name: "Witchly AFK App",
        isHidden: true
    });
    autoLauncher.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLauncher.enable();
    }).catch((err) => {
        throw err;
    });

    // Auto update
    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall();
    })
    app.on('ready', () => {
        autoUpdater.checkForUpdates()

        setInterval(() => {
            autoUpdater.checkForUpdates()
        }, 60_000 * 20) // Every 20 minutes check for updates
    });
}

export class WitchlyDesktopInstance {
    public isQuitting = false;
    public isHidden = false;
    public window;
    public tray;
    public sdk?: SdkInstance;

    constructor() {
        this.tray = createTray(this);
        this.window = createWindow(this);
        this.loadSdk();

        loadIpcHandlers(this);
    }

    loadSdk() {
        if (this.sdk) return;
        const data = getData();
        this.sdk = data.userId && data.token ? new SdkInstance(SONIC_SDK_APP_ID, data.userId!, data.earningEnabled) : undefined;
    }
}

app.once('ready', async () => {
    if (!hasConsented()) {
        if (!await getConsent()) {
            return app.quit();
        };
        setConsented();
    }

    new WitchlyDesktopInstance();
});
