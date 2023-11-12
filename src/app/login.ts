import WebSocket from "ws";
import { shell } from "electron";
import { getData, setData } from "../utils/data";
import fetch from "node-fetch";

const loginServer = "login.witchly.host";
const useSecureConn = true;

const sessionServerAddr = `${useSecureConn ? 'wss://' : 'ws://'}${loginServer}/session`;
const apiServerAddr = `${useSecureConn ? 'https://' : 'http://'}${loginServer}`;

export function login(cb: (status: 'linkOpened' | 'failed' | 'success', id?: string) => void) {
    const ws = new WebSocket(sessionServerAddr);

    const closeListener = () => cb('failed');
    ws.on('close', closeListener);

    ws.on('message', async data => {
        const msg = JSON.parse(data.toString()) as {
            type: 'session',
            code: string
        } | {
            type: "authorized",
            id: string,
            token: string
        };

        switch (msg.type) {
            case "session":
                await shell.openExternal(`${apiServerAddr}/login?session=${encodeURIComponent(msg.code)}`);
                cb('linkOpened');
                break;
            case "authorized":
                setData({
                    userId: msg.id,
                    token: msg.token,
                    earningEnabled: true
                });
                cb('success', msg.id);
                ws.off('close', closeListener);
                break;
        }
    })
}

export async function getUserInfo(): Promise<{
    username: string,
    coins: number,
    afkAppCoinsPerMin: number,
    recentEarnings: {
        userId: string;
        coins: number;
        time: number;
    }[]
}> {
    const token = getData().token;
    if (!token) throw new Error('The token is not saved in the data.');
    const resp = await (await fetch(`${apiServerAddr}/userInfo`, {
        headers: {
            'authorization': token
        }
    })).json();
    return resp;
}