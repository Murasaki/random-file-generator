import "mocha";
import { expect } from "chai";
import Sinon = require("sinon");
import { BytesInKiloBytes, BytesInMB } from "./constants";

describe("constants", () => {
    it("should return correct values", () => {
        expect(BytesInKiloBytes).to.equal(1024);
        expect(BytesInMB).to.equal(1024 * 1024);
    });
});