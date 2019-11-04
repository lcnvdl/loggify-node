const { expect } = require("chai");
const Manager = require("../src/manager");

describe("Manager", () => {
    it("#constructor", () => {
        let manager = new Manager("test");
        expect(manager).to.be.ok;
    });
});