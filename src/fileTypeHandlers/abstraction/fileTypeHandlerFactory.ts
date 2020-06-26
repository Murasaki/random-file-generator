import { SupportedFileType } from "../..";
import { JpegFileTypeHandler } from "../jpegFileTypeHandler";
import { FileTypeHandlerBase } from "./fileTypeHandlerBase";
import { PngFileTypeHandler } from "../pngFileTypeHandler";
import { TiffFileTypeHandler } from "../tiffFileTypeHandler";
import { RawFileTypeHandler } from "../rawFileTypeHandler";
import { XLSXFileTypeHandler } from "../xlsxFileTypeHandler";
import { DOCXFileTypeHandler } from "../docxFileTypeHandler";
import { PPTXFileTypeHandler } from "../pptxFileTypeHandler";

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