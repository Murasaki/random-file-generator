import "mocha";
import { expect } from "chai";

/** Code in test */
import { getFileTypeHandler } from "./abstraction/fileTypeHandlerFactory";
import { SupportedFileType } from "..";

const BytesInKiloBytes = 1024;
const BytesInMB = BytesInKiloBytes * 1024;
const defaultMaxDegreeOfInaccuracyInBytes = (BytesInMB / 40);
const fileType: SupportedFileType = "XLSX";

describe("index", function () {
    it("Can create an " + fileType + " document without inaccuracy specified", async () => {
        const handler = getFileTypeHandler(fileType);

        const result = await handler.Handle({
            fileType: fileType,
            targetLengthMB: .5
        });

        expect(result.length).to.be.greaterThan((BytesInMB / 2) - defaultMaxDegreeOfInaccuracyInBytes)
            .and.lessThan((BytesInMB / 2) + defaultMaxDegreeOfInaccuracyInBytes);
    });

    it("Can create an " + fileType + " document with inaccuracy specified", async () => {
        const handler = getFileTypeHandler(fileType);

        const result = await handler.Handle({
            fileType: fileType,
            targetLengthMB: .5,
            maxDegreeOfInaccuracyInBytes: BytesInMB
        });

        expect(result.length).to.be.greaterThan((BytesInMB / 2) - BytesInMB)
            .and.lessThan((BytesInMB / 2) + BytesInMB);
    });
});