/** @typedef {import("./log-message")} LogMessage */

const axios = require("axios");

class LoggifyClient {
    constructor(project, key, url) {
        this._axios = null;
        this._token = null;
        this.project = project;
        this.key = key;
        this.url = url;
        this.currentFantasySessionId = "D" + (new Date().getTime());
    }

    async _assertSession() {
        if (!this._axios) {
            const { token } = await axios.post(`${this.url}/auth/login`, {
                project: this.project,
                key: this.key
            });

            this._token = token;

            let authHeader = "Basic " + Buffer.from(`${this.project}:${this._token}`).toString("base64");

            this._axios = axios.create({
                baseUrl: this.url,
                headers: {
                    "Authorization": authHeader,
                    "AppSession": this.currentFantasySessionId
                },
                timeout: 30000
            });
        }
    }

    async initialize() {
        await this._assertSession();
    }

    /**
     * @param {LogMessage[]} logs Logs
     */
    async sync(logs) {
        await this._assertSession();
        await this._axios.post("logs", { logs });
    }

    async clear() {
        await this._assertSession();
        await this._axios.delete("logs");
    }
}

module.exports = LoggifyClient;