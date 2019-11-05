const Storage = require("./storage");
const LogMessage = require("./log-message");
const LoggifyClient = require("./client");

class LoggifyManager {
    constructor(project, key, settings) {
        settings = settings || {};

        const { url, timerInterval = 15000, logsLimit = 10, disableStorage = false } = settings;

        /** @type {string} */
        this.project = project;

        /** @type {string} */
        this.key = key;

        /** @type {LogMessage[]} */
        this.logs = disableStorage ? [] : (Storage.loadObjectSync(this._logsKey) || []);

        /** @type {string} */
        this.userId = null;

        this.url = url;
        this.disableStorage = disableStorage;
        this.syncTimerInterval = timerInterval;
        this.syncLogsLimit = logsLimit;

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

        if (!this.disableStorage) {
            await Storage.saveObject(this._logsKey, this.logs);
        }

        return msg;
    }

    async sync() {
        if (!this.logs.length) {
            return 0;
        }

        let counter;

        if (this.syncLogsLimit === 0 || this.logs.length <= this.syncLogsLimit) {
            await this._client.sync(this.logs);
            counter = this.logs.length;
            this.logs = [];
        }
        else {
            let logs = this.logs.slice(0, this.syncLogsLimit);
            await this._client.sync(logs);
            counter = logs.length;
            this.logs.splice(0, this.syncLogsLimit);
        }

        if (!this.disableStorage) {
            await Storage.saveObject(this._logsKey, this.logs);
        }

        return counter;
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