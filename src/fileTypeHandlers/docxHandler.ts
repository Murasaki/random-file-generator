import { GenerateOptions, generateRandomBuffer } from "..";
import { FileTypeHandlerBase } from "./abstraction/fileTypeHandlerBase";
import { BytesInMB } from "../constants";

export class DOCXFileTypeHandler implements FileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            resolve(Buffer.alloc(options.targetLengthMB * BytesInMB));
        })
    }
}