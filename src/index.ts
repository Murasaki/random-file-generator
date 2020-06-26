import sharp = require("sharp");
import { GenerateArgumentException } from "./exceptions";
import { BytesInMB } from "./constants";
import { getFileTypeHandler } from "./fileTypeHandlers/abstraction/fileTypeHandlerFactory";

/** A callback that determines the output file for images generated with sharp */
export type SharpFileTypeCallback = (img: sharp.Sharp) => sharp.Sharp;

/** File types generated with sharp */
export type SharpFileTypes = "PNG" | "JPEG" | "TIFF";

/** File types generated with Officegen lib */
export type OfficeGenFileTypes = "PPTX" | "XLSX" | "DOCX";

/** The list of supported file types that can be generated, 'None' will generate a raw block of data. */
export type SupportedFileType = SharpFileTypes | OfficeGenFileTypes | "None";

export const SupportedFileTypes: SupportedFileType[] = [
    "PNG",
    "JPEG", 
    "TIFF",
    "PPTX",
    "XLSX",
    "DOCX",

    "None"
];

/** Options that dictate the output randomized file */
export type GenerateOptions = {
    /** A string that must be in the list of supported file types of the generator */
    fileType: SupportedFileType;

    /** Specify the target size in megabytes that the output file should be */
    targetLengthMB: number;

    /** If generating an image, specify a callback on the sharp image that will determine the file type. e.g 'img => img.png({ ...options })' */
    sharpFileTypeCallback?: SharpFileTypeCallback;

    /** Specifies how close to the target in bytes the generated file needs to be */
    maxDegreeOfInaccuracyInBytes?: number;
};

export const generateRandomBuffer = async(sizeInBytes: number): Promise<Buffer> => {
    if (!sizeInBytes || sizeInBytes <= 0) {
        throw new GenerateArgumentException("sizeInBytes", sizeInBytes)
    }

    const frameData = Buffer.alloc(sizeInBytes);

    let i = 0;
    while (i < frameData.length) {
        frameData[i++] = Math.floor(Math.random() * 256);
    }

    return frameData;
}

/** Generates a Buffer with sharp
 * @param height height in pixels that the image should be
 * @param width width in pixels that the image should be 
 * @param sharpFileTypeCallback An optional callback on the raw sharp image for chaining.
 * @returns A buffer containing the file.
 */
export const generateRandomImageBuffer = async (height: number, width: number, sharpFileTypeCallback?: SharpFileTypeCallback): Promise<Buffer> => {
    if (!height || height <= 0) {
        throw new GenerateArgumentException("height", height)
    }

    if (!width || width <= 0) {
        throw new GenerateArgumentException("width", width)
    }

    const frameData = await generateRandomBuffer(width * height * 4);

    if (!sharpFileTypeCallback) {
        sharpFileTypeCallback = img => img;
    }

    return sharpFileTypeCallback(sharp(frameData, {
        raw: {
            height: height,
            width: width,
            channels: 4
        },
        limitInputPixels: false
    })).toBuffer();
};

/** Creates a random file Buffer from the specified options
 * @param options Options that dictate how a file is created
 * @returns A buffer containing the file.
 */
export const generateRandomFile = async (options: GenerateOptions): Promise<Buffer> => {
    if (!options) {
        throw new GenerateArgumentException("options", options);
    }
    
    if (!options.fileType) {
        throw new GenerateArgumentException("options.fileType", options.fileType);
    }

    if (!options.targetLengthMB) {
        throw new GenerateArgumentException("options.targetLengthMB", options.targetLengthMB);
    }

    const fileTypeHandler = getFileTypeHandler(options.fileType);
    return await fileTypeHandler.Handle(options);
};