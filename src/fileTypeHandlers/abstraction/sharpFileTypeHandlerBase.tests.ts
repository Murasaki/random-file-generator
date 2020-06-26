import "mocha";
import { expect } from "chai";

/** Code in test */
import Sinon = require("sinon");
import { Sharp } from "sharp";
import sharp = require("sharp");

import { defaultCallbacks } from "./sharpFileTypeHandlerBase";

describe("sharpFileTypeHandlerBase", () => {
    let sharpStub: Sinon.SinonStubbedInstance<any>;

    describe("defaultCallbacks", () => {
        let result: Sharp;

        const fileTypeTest = (propertyInTest: string, sharpFunc: string) => {
            beforeEach(() => {
                sharpStub = Sinon.createStubInstance(sharp);
                sharpStub[sharpFunc].returns(sharpStub);
                result = defaultCallbacks[propertyInTest](sharpStub as sharp.Sharp)
            });

            it("should invoke " + propertyInTest, async () => {
                expect(sharpStub[sharpFunc].getCalls()).lengthOf(1);
            });

            it("should return " + propertyInTest + " result", async () => {
                expect(result).to.equal(sharpStub);
            });
        }

        describe("PNG", () => fileTypeTest("PNG", "png"));
        describe("PNG", () => fileTypeTest("JPEG", "jpeg"));
        describe("PNG", () => fileTypeTest("TIFF", "tiff"));
    });
})