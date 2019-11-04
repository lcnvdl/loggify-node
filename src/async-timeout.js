function asyncTimeout(time, fn, timeoutResultCallback) {
    return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
            try {
                let result = fn && fn();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }, time || 1);

        timeoutResultCallback && timeoutResultCallback(timeout);
    });
}

module.exports = asyncTimeout;