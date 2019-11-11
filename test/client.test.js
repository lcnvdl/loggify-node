const Client = require("../src/client");
const { expect } = require("chai");

describe("Client", () => {
    it("#constructor", () => {
        let obj = new Client();
        expect(obj).to.be.ok;
    });
});