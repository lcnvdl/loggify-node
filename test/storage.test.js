const Storage = require("../src/storage");
const { expect } = require("chai");

describe("Storage", () => {
    describe("#clear", () => {
        afterEach(() => {
            Storage.clearSync();
        });

        it("should work fine", async () => {
            await Storage.saveObject("n", {});
            obj = await Storage.loadObject("n");
            expect(obj).to.be.ok;

            await Storage.clear();
            obj = await Storage.loadObject("n");
            expect(obj).to.be.null;
        });
    });

    describe("#saveObject", () => {
        afterEach(() => {
            Storage.clearSync();
        });

        it("should work fine", async () => {
            let obj = await Storage.loadObject("n");
            expect(obj).to.be.null;
            
            await Storage.saveObject("n", {});
            obj = await Storage.loadObject("n");
            expect(obj).to.be.ok;
        });
    });

    describe("#loadObjectSync", () => {
        afterEach(() => {
            Storage.clearSync();
        });

        it("should bring null if not exists", () => {
            let obj = Storage.loadObjectSync("test");
            expect(obj).to.be.null;
        });

        it("should bring an object if exists", () => {
            Storage.saveObjectSync("m", { test: true });
            let obj = Storage.loadObjectSync("m");
            expect(obj).to.be.ok;
            expect(obj.test).to.be.true;
        });
    });
});