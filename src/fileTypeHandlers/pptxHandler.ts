import { GenerateOptions } from "..";
import { FileTypeHandlerBase } from "./abstraction/fileTypeHandlerBase";
import { BytesInMB } from "../constants";

export class PPTXFileTypeHandler implements FileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            resolve(Buffer.alloc(BytesInMB * options.targetLengthMB));
        })
    }
}