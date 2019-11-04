const Storage = require("./storage");
const LogMessage = require("./log-message");
const LoggifyClient = require("./client");

class LoggifyManager {
    constructor(project, key, url, syncTimerInterval) {
        this.url = url;
        this.project = project;
        this.key = key;
        this.logs = Storage.loadObjectSync(this._logsKey) || [];
        this.userId = null;
        this.syncTimerInterval = syncTimerInterval || 15000;

        this._client = new LoggifyClient(this.project, this.key, this.url);
        this._isSyncing = false;
        this._interval = null;
    }

    get _logsKey() {
        return `${this.project}-logs`;
    }

    /**
     * @param {string} internalUserId Internal user ID
     */
    setUser(internalUserId) {
        this.userId = internalUserId;
    }

    /**
     * @param {"DEBUG"|"INFO"|"WARN"|"ERROR"} [type] Type
     * @param {string} [message] Message
     * @param {Date} [date] Date
     * @param {*} [extraData] Extra data
     */
    async log(type, message, date, extraData) {
        const msg = new LogMessage(type, message, date, extraData);
        this.logs.push(msg);
        await Storage.saveObject(this._logsKey, this.logs);
    }

    async sync() {
        await this._client.sync(this.logs);
        this.logs = [];
        await Storage.saveObject(this._logsKey, this.logs);
    }

    dispose() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    setAutoSync(value) {
        if (!value) {
            this.dispose();
            return;
        }

        if (this._interval) {
            return;
        }

        this._interval = setInterval(async () => {
            if (!this._isSyncing) {
                this._isSyncing = true;

                try {
                    await this.sync();
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    this._isSyncing = false;
                }
            }
        }, this.syncTimerInterval);
    }
}

module.exports = LoggifyManager;