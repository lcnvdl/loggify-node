const asyncTimeout = require("./async-timeout");

let ls;

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    ls = new LocalStorage('./scratch');
}
else {
    ls = localStorage;
}

class Storage {
    static loadObjectSync(key) {
        let v = ls.getItem(key);
        if (!v) {
            return null;
        }

        return JSON.parse(v);
    }

    static saveObjectSync(key, obj) {
        if (typeof obj !== "string") {
            obj = JSON.stringify(obj);
        }

        ls.setItem(key, obj);
    }

    static clearSync() {
        ls.clear();
    }

    static async clear() {
        return await asyncTimeout(1, () => Storage.clearSync());
    }

    static async loadObject(key) {
        return await asyncTimeout(1, () => Storage.loadObjectSync(key));
    }

    static async saveObject(key, obj) {
        await asyncTimeout(1, () => Storage.saveObjectSync(key, obj));
    }
}

module.exports = Storage;