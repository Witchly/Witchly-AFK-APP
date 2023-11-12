import { getAppDir } from "../utils/data";
import downloadBinary from "./downloadBinary";
import { spawn } from "child_process";
import { EventEmitter } from "events";

export class SdkInstance extends EventEmitter {
    private binaryPath;
    private process?: ReturnType<typeof spawn>;
    public connected = false;

    constructor(public appKey: string, public appUserId: string, private enabled: boolean) {
        super();

        this.binaryPath = downloadBinary();
        this.start();
    }

    private async start() {
        if (!this.enabled) return;

        let binaryPath;
        try {
            binaryPath = await this.binaryPath;
            if (!binaryPath) {
                // An error occured, retry
                await new Promise(resolve => setTimeout(resolve, 2500));
                this.binaryPath = downloadBinary();
                this.start()
                return
            }
        } catch (err) {
            this.binaryPath = downloadBinary();
            setTimeout(() => this.start(), 500);
            return
        }

        this.process = spawn(binaryPath, [
            '--app-key', this.appKey,
            '--app-user-id', this.appUserId
        ], {
            cwd: getAppDir()
        });

        this.process.on('exit', () => {
            if (this.enabled) {
                // Check for updates
                this.binaryPath = downloadBinary();

                setTimeout(() => {
                    this.start();
                }, 2500);
            }
        })

        this.process.stdout?.on('data', d => {
            const str = d.toString();
            if (str.trim().includes('\n')) {
                // Seperate the output in to lines to prevent clumped together output
                for (const line of str.trim().split('\n')) this.process?.stdout?.emit('data', line);
                return;
            }

            try {
                const json = JSON.parse(d) as {
                    connected: boolean,
                    type: 'info' | 'error',
                    msg: string
                };

                console.log('got msg from sdk:', json)

                const oldConnected = this.connected;
                this.connected = json.connected;
                if (oldConnected !== this.connected) this.emit('statusUpdate', this.connected);
                
                if (json.type === 'error') this.emit('errorMessage', json.msg);
            } catch(_) {}
        })
    }

    enable() {
        if (this.enabled) return;
        this.enabled = true;
        this.start();
    }

    disable() {
        this.enabled = false;
        this.connected = false;
        if (this.process) {
            this.process.kill();
            this.process = undefined;
            this.emit('statusUpdate', this.connected);
        }
    }

    setAppUserId(id: string) {
        if (id === this.appUserId) return;
        this.appUserId = id;
        if (this.enabled) {
            // Restart with new ID
            this.disable();
            this.enable();
        }
    }
}