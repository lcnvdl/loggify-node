let globalProjectKey = null;
let globalInstance = null;
let globalUrl = "http://localhost:3500";
let currentFantasySessionId = "D" + (new Date().getTime());

class LoggifyClient {
    static setup(projectKey, customUrl) {
        globalProjectKey = projectKey;
        globalUrl = customUrl || globalUrl;
    }

    static getInstance() {
        return globalInstance || (globalInstance = new LoggifyClient());
    }

    addLog(type, text) {
    }
}

module.exports = LoggifyClient;