import { SupportedFileType } from "../..";
import { JpegFileTypeHandler } from "../jpegHandler";
import { FileTypeHandlerBase } from "./fileTypeHandlerBase";
import { PngFileTypeHandler } from "../pngHandler";
import { TiffFileTypeHandler } from "../tiffHandler";
import { RawFileTypeHandler } from "../rawHandler";
import { XLSXFileTypeHandler } from "../xlsxHandler";
import { DOCXFileTypeHandler } from "../docxHandler";
import { PPTXFileTypeHandler } from "../pptxHandler";

export const getFileTypeHandler = (fileType: SupportedFileType): FileTypeHandlerBase => {
    switch (fileType) {
        case "JPEG": return new JpegFileTypeHandler;
        case "PNG": return new PngFileTypeHandler;
        case "TIFF": return new TiffFileTypeHandler;
        case "XLSX": return new XLSXFileTypeHandler;
        case "PPTX": return new PPTXFileTypeHandler;
        case "DOCX": return new DOCXFileTypeHandler;
        default: return new RawFileTypeHandler();
    }
} 