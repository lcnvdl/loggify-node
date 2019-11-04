const uuid = require("uuid/v1");

class LogMessage {
    /**
     * @param {"DEBUG"|"INFO"|"WARN"|"ERROR"} [type] Type
     * @param {string} [message] Message
     * @param {Date} [date] Date
     * @param {string} [internalUserId] Internal user id
     * @param {*} [extraData] Extra data
     */
    constructor(type, message, date, internalUserId, extraData) {
        this.uuid = uuid();
        this.date = date || new Date();
        this.type = type || "INFO";
        this.message = message || null;
        this.internalUserId = internalUserId || null;
        this.extraData = extraData || null;
    }
}

module.exports = LogMessage;