const { expect } = require("chai");
const Manager = require("../src/manager");

describe("Manager", () => {
    describe("constructor", () => {
        it("#constructor", () => {
            let manager = new Manager("test", "key", {});
            expect(manager).to.be.ok;
        });
    });

    describe("sync", () => {

        let manager;

        beforeEach(() => {
            manager = new Manager("test", "key", { logsLimit: 5, disableStorage: true });
        });

        it("should respect the limits", async () => {
            manager._client = {
                async sync() {
                    await Promise.resolve();
                }
            };

            for (let i = 0; i < 11; i++) {
                await manager.log();
            }

            expect(manager.logs.length).to.equals(11);

            let counter = await manager.sync();
            expect(counter).to.equals(5);

            expect(manager.logs.length).to.equals(6);

            counter = await manager.sync();
            expect(counter).to.equals(5);
            expect(manager.logs.length).to.equals(1);

            counter = await manager.sync();
            expect(counter).to.equals(1);
            expect(manager.logs.length).to.equals(0);

            counter = await manager.sync();
            expect(counter).to.equals(0);
            expect(manager.logs.length).to.equals(0);
        });
    });
});