import { WitchlyDesktopInstance } from ".";
import { Tray, Menu, app } from "electron";
import path from "path";

export default function createTray(instance: WitchlyDesktopInstance) {
    const tray = new Tray(path.join(__dirname, '../icon.png'));

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                instance.window.show()
                instance.isHidden = false;
            }
        },
        {
            label: 'Quit',
            click: () => {
                instance.isQuitting = true;
                app.quit();
            }
        }
    ]))

    tray.on('click', () => {
        instance.window.show()
        instance.isHidden = false;
    });

    return tray;
}