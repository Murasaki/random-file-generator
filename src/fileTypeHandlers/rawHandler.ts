import { GenerateOptions, generateRandomBuffer } from "..";
import { FileTypeHandlerBase } from "./abstraction/fileTypeHandlerBase";
import { BytesInMB } from "../constants";

export class RawFileTypeHandler implements FileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        return await generateRandomBuffer(options.targetLengthMB * BytesInMB);
    }
}