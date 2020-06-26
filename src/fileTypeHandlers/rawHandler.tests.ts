import "mocha";
import { expect } from "chai";
import Sinon = require("sinon");
import { BytesInMB } from "../constants";
import { getFileTypeHandler } from "./abstraction/fileTypeHandlerFactory";

describe("RawFileTypeHandler", () => {
    it("should return a buffer of specified size", async () => {
        const buffer = await getFileTypeHandler("None").Handle({
            fileType: "None", 
            targetLengthMB: 1
        });

        expect(buffer.length).to.equal(BytesInMB);
    });
});