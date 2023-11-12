import { app } from "electron";

/**
 * Function used to distinguish if the app was automatically opened on boot or the user opened it
 */
export default function wasOpenedAtLogin() {
    try {
        if (process.platform === 'darwin') {
            let loginSettings = app.getLoginItemSettings();
            return loginSettings.wasOpenedAtLogin;
        }
        return app.commandLine.hasSwitch("hidden");
    } catch {
        return false;
    }
}