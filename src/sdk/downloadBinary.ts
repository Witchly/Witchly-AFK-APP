import { getAppDir } from "../utils/data";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { DownloaderHelper } from "node-downloader-helper";

const cdnUrl = `https://pondwader.xyz/static/sonic-sdk`

export default function downloadBinary(): Promise<string> {
    return new Promise(async (resolve, err) => {
        const appDir = getAppDir();

        let binaryName = 'Sonic-SDK-Client-';

        if (process.platform === 'win32') {
            binaryName += 'windows-';
            if (process.arch === 'x64') binaryName += 'x64.exe';
            else binaryName += 'x32.exe';
        } else if (process.platform === 'linux') {
            binaryName += 'linux-';
            if (process.arch === 'arm64') binaryName += 'aarch64';
            else if (process.arch === 'x64') binaryName += 'x86-64';
            else binaryName += '386';
        }

        const binaryPath = path.join(appDir, binaryName);
        const versionPath = path.join(appDir, 'version.txt');

        const latestVersion = await fetch(`${cdnUrl}/latest.txt`).then(res => res.text());

        if (fs.existsSync(binaryPath) && fs.existsSync(versionPath)) { 
            const versionDownloaded = fs.readFileSync(versionPath, 'utf-8');
            if (latestVersion === versionDownloaded) return resolve(binaryPath);
        }

        const dl = new DownloaderHelper(`${cdnUrl}/${binaryName}`, appDir, {
            fileName: binaryName,
            override: true
        });

        dl.on('end', () => {
            fs.writeFileSync(path.join(appDir, 'version.txt'), latestVersion);
            resolve(binaryPath)
        });
        dl.on('error', err);
        dl.start();
    })
}