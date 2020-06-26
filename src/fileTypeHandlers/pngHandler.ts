import { GenerateOptions } from "..";
import { SharpFileTypeHandlerBase } from "./abstraction/sharpFileTypeHandlerBase";

export class PngFileTypeHandler implements SharpFileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        return await SharpFileTypeHandlerBase.HandleSharpImage(options);
    }
}