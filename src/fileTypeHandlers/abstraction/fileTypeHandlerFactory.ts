import { SupportedFileType } from "../..";
import { JpegFileTypeHandler } from "../jpegFileTypeHandler";
import { FileTypeHandlerBase } from "./fileTypeHandlerBase";
import { PngFileTypeHandler } from "../pngFileTypeHandler";
import { TiffFileTypeHandler } from "../tiffFileTypeHandler";
import { RawFileTypeHandler } from "../rawFileTypeHandler";

export const getFileTypeHandler = (fileType: SupportedFileType): FileTypeHandlerBase => {
    if (fileType === "JPEG") {
        return new JpegFileTypeHandler();
    } else if (fileType === "PNG") {
        return new PngFileTypeHandler();
    } else if (fileType === "TIFF") {
        return new TiffFileTypeHandler();
    }

    return new RawFileTypeHandler();
} 