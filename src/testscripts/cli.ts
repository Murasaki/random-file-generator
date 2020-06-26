import { writeFileSync } from "fs";
import { generateRandomFile, SupportedFileType } from "..";

const fileType = process.argv[2] as SupportedFileType;
const targetMB = parseInt(process.argv[3]);

console.log(`generating ${targetMB}MB ${fileType} file`);
generateRandomFile({
    fileType: fileType,
    targetLengthMB: targetMB
}).then(buffer => {
    console.log("writing file");
    writeFileSync(`testfiles/~${targetMB}MB.xlsx`, buffer);
    console.log("written file");
}, err => {
    console.log(err);
}).catch(err => {
    console.log(err);
}).finally(() => {
    console.log("Done.");
});