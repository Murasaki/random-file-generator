import "mocha";
import { expect } from "chai";

/** Code in test */
import { defaultCallbacks, generateRandomImageBuffer, generateRandomFile, GenerateArgumentException, maxDegreeOfInaccuracyInBytes } from "./index";
import Sinon = require("sinon");
import { Sharp } from "sharp";
import sharp = require("sharp");

const BytesInKiloBytes = 1024;
const BytesInMB = BytesInKiloBytes * 1024;

describe("index", function() {
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

    describe("generateRandomImageBuffer", () => {
        const testArg = (height: number, width: number, expectedArg: string) => {
            const expectedValue = height > 0 ? width : height;

            it(`${expectedArg} should throw error with ${expectedValue}`, async () => {
                try {
                    await generateRandomImageBuffer(height, width)
                }
                catch (err) {
                    expect(err).to.be.instanceOf(GenerateArgumentException);
                    const argErr = err as GenerateArgumentException;
                    expect(argErr.message).to.equal(`Argument '${expectedArg}' is not a valid value. Value: '${expectedValue}'`)
                }
            });   
        }
        
        testArg(undefined, 1, "height");
        testArg(null, 1, "height");
        testArg(0, 1, "height");
        testArg(1, undefined, "width");
        testArg(1, null, "width");
        testArg(1, 0, "width");

        it("should return a raw buffer if callback is not defined", async () => {
            const buffer = await generateRandomImageBuffer(100, 100);

            expect(buffer).to.not.be.undefined;
            expect(buffer.length).to.equal(100 * 100 * 4);
        });

        it("should return a png buffer if png callback is defined", async() => {
            const buffer = await generateRandomImageBuffer(100, 100, img => img.png());

            expect(buffer).to.not.be.undefined;
            expect(buffer.length).to.equal(40247); 
        });

        it("should return a jpeg buffer if jpeg callback is defined", async() => {
            const buffer = await generateRandomImageBuffer(100, 100, img => img.jpeg());

            expect(buffer).to.not.be.undefined;
            expect(buffer.length).to.greaterThan(0); // compression taken into account
        });

        it("should return a tiff buffer if tiff callback is defined", async() => {
            const buffer = await generateRandomImageBuffer(100, 100, img => img.tiff());

            expect(buffer).to.not.be.undefined;
            expect(buffer.length).to.greaterThan(0); // compression taken into account
        });
    });

    describe("generateRandomFile", () => {
        let result: Buffer;

        it("should throw with undefined options", async() => {
            try {
                result = await generateRandomFile(undefined);
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options' is not a valid value. Value: 'undefined'`)
            }
        });
        
        it("should throw with null options", async() => {
            try {
                result = await generateRandomFile(null);
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options' is not a valid value. Value: 'null'`)
            }
        });       

        it("should throw with undefined options.filetype", async() => {
            try {
                result = await generateRandomFile({
                    fileType: undefined,
                    targetLengthMB: 5
                });
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options.fileType' is not a valid value. Value: 'undefined'`)
            }
        });
        
        it("should throw with null options.filetype", async() => {
            try {
                result = await generateRandomFile({
                    fileType: null,
                    targetLengthMB: 5
                });
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options.fileType' is not a valid value. Value: 'null'`)
            }
        });
        
        it("should throw with undefined options.targetLengthMB", async() => {
            try {
                result = await generateRandomFile({
                    fileType: "JPEG",
                    targetLengthMB: undefined
                });
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options.targetLengthMB' is not a valid value. Value: 'undefined'`)
            }
        });
        
        it("should throw with null options.targetLengthMB", async() => {
            try {
                result = await generateRandomFile({
                    fileType: "JPEG",
                    targetLengthMB: null
                });
            }
            catch (err) {
                expect(err).to.be.instanceOf(GenerateArgumentException);
                const argErr = err as GenerateArgumentException;
                expect(argErr.message).to.equal(`Argument 'options.targetLengthMB' is not a valid value. Value: 'null'`)
            }
        });

        it("should be able to generate a 1MB JPEG file, close enough", async function() {
            this.timeout(10000);

            result = await generateRandomFile({
                fileType: "JPEG",
                targetLengthMB: 1
            })

            expect(result.length).to.be.greaterThan(BytesInMB - (BytesInMB - maxDegreeOfInaccuracyInBytes))
            .and.lessThan(BytesInMB + maxDegreeOfInaccuracyInBytes)
        });

        it("should be able to generate a 1MB TIFF file, close enough", async function() {
            this.timeout(10000);

            result = await generateRandomFile({
                fileType: "TIFF",
                targetLengthMB: 1
            })

            expect(result.length).to.be.greaterThan(BytesInMB - (BytesInMB - maxDegreeOfInaccuracyInBytes))
            .and.lessThan(BytesInMB + maxDegreeOfInaccuracyInBytes)
        });

        it("should be able to generate a 1MB PNG file, close enough", async function() {
            this.timeout(10000);

            result = await generateRandomFile({
                fileType: "PNG",
                targetLengthMB: 1
            })

            expect(result.length).to.be.greaterThan(BytesInMB - (BytesInMB - maxDegreeOfInaccuracyInBytes))
            .and.lessThan(BytesInMB + maxDegreeOfInaccuracyInBytes)
        });
    });
})