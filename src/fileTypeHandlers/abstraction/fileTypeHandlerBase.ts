import { GenerateOptions } from "../../index";

export class FileTypeHandlerBase {
    Handle: (options: GenerateOptions) => Promise<Buffer>;
}