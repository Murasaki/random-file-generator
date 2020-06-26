import { GenerateOptions } from "..";
import { FileTypeHandlerBase } from "./abstraction/fileTypeHandlerBase";
import { BytesInMB } from "../constants";
import { WorkBook, utils, write } from "xlsx";

const alphabet: string[] = Array.apply(0, Array(26)).map((_: any, i: number) => {
    return String.fromCharCode(65 + i);
});

export class XLSXFileTypeHandler implements FileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            if (!options.maxDegreeOfInaccuracyInBytes) {
                options.maxDegreeOfInaccuracyInBytes = BytesInMB / 40;
            }

            const targetInBytes = options.targetLengthMB * BytesInMB;
            const lowerThreshold = Math.floor(targetInBytes - options.maxDegreeOfInaccuracyInBytes);
            const wb = utils.book_new();

            const rows = Array.apply(0, Array(100)).map((_: any, index: number) => {
                const row: { [col: string]: number|string } = {};

                alphabet.forEach(column => {
                    row[column] = String.fromCharCode(Math.ceil(Math.random() * 65535))
                });

                return row;
            });

            while (true) {
                utils.book_append_sheet(wb, utils.json_to_sheet(rows, {
                    header: alphabet,
                    skipHeader: true
                }));

                const buffer = write(wb, {
                    bookType: "xlsx",
                    type: "buffer"
                });

                if (buffer.length > lowerThreshold) {
                    resolve(buffer);
                    break;
                }

                console.log(`XLSX file is currently ${buffer.length} bytes, need ${lowerThreshold - buffer.length} more bytes...`);
            }
        });
    }
}