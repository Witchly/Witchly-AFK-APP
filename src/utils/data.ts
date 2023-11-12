import { app } from "electron";
import fs from "fs";
import path from "path";

const appDir = path.join(app.getPath('appData'), '/witchly-afk');
const dataFile = path.join(appDir, 'data.json');
const consentFile = path.join(appDir, 'consented')

if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
}
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({
        earningEnabled: true
    }))
}

export function hasConsented() {
    return fs.existsSync(consentFile);
}
export function setConsented() {
    fs.writeFileSync(consentFile, 'true');
}

type Data = {
    token?: string;
    userId?: string;
    earningEnabled: boolean;
}

export function getData(): Data {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
}

export function setData(data: Data) {
    return fs.writeFileSync(dataFile, JSON.stringify(data));
}

export function updateData<K extends keyof Data>(key: K, value: Data[K]) {
    const data = getData();
    data[key] = value;
    setData(data);
    return data;
}

export const getAppDir = () => appDir;