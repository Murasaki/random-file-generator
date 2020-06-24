import sharp = require("sharp");

const BytesInKiloBytes = 1024;
const BytesInMB = BytesInKiloBytes * 1024;

/** A callback that determines the output file for images generated with sharp */
export type SharpFileTypeCallback = (img: sharp.Sharp) => sharp.Sharp;

/** The list of supported file types that can be generated */
export type SupportedFileType = "PNG" | "JPEG" | "TIFF";

/** Options that dictate the output randomized file */
export type GenerateOptions = {
    /** A string that must be in the list of supported file types of the generator */
    fileType: SupportedFileType;

    /** Specify the target size in megabytes that the output file should be */
    targetLengthMB: number;

    /** If generating an image, specify a callback on the sharp image that will determine the file type. e.g 'img => img.png({ ...options })' */
    sharpFileTypeCallback?: SharpFileTypeCallback;
};

/** A lookup for each of the supported file types that are images, 
 * the value looked up is a callback after instantiating a raw image buffer with sharp to specify file type */
export const defaultCallbacks:  { [fileType in SupportedFileType]: SharpFileTypeCallback; } = {
    /** The default callback for png, calls sharp.png() with no options */
    PNG: img => img.png(),

    /** The default callback for jpeg, calls sharp.jpeg() with no options */
    JPEG: img => img.jpeg(),

    /** The default callback for tiff, calls sharp.tiff() with no options */
    TIFF: img => img.tiff()
}

/** Generates a Buffer with sharp
 * @param height height in pixels that the image should be
 * @param width width in pixels that the image should be 
 * @param sharpFileTypeCallback An optional callback on the raw sharp image for chaining.
 * @returns A buffer containing the file.
 */
export const generateRandomImageBuffer = async (height: number, width: number, sharpFileTypeCallback?: SharpFileTypeCallback): Promise<Buffer> => {
    const frameData = Buffer.alloc(width * height * 4);
    let i = 0;

    while (i < frameData.length) {
        frameData[i++] = Math.floor(Math.random() * 256);
    }

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
        throw "Argument cannot be null or undefined: options";
    }

    if (!options.sharpFileTypeCallback) {
        options.sharpFileTypeCallback = defaultCallbacks[options.fileType.toUpperCase()]
    }

    const targetLength = BytesInMB * options.targetLengthMB;
    const pixelSize = 4;
    const pixels = targetLength / pixelSize;
    const squareRoot = Math.ceil(Math.sqrt(pixels));

    let lastWidth = squareRoot;
    let lastHeight = squareRoot;
    let pixelIncrement = 100;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const currentHeight = lastHeight;
        const currentWidth = lastWidth;

        const buf = await generateRandomImageBuffer(currentHeight, currentWidth, options.sharpFileTypeCallback);

        if (buf.length <= (targetLength - (BytesInMB / 4))) {
            lastHeight += pixelIncrement;
            lastWidth += pixelIncrement;

            console.log(`${new Date().toTimeString()} ${options.fileType}: Target ${options.targetLengthMB}MB ` +
                `Actual ${(buf.length / BytesInMB).toFixed(2)}MB - ${currentHeight}x${currentWidth} needs ${((targetLength - buf.length) / BytesInMB).toFixed(2)}MB, ` +
                `changing h/w +${pixelIncrement} to ${lastWidth}x${lastHeight}...`);
        }
        else if (buf.length >= (targetLength + (BytesInMB / 4))) {
            if (pixelIncrement > 10) {
                pixelIncrement = Math.ceil(pixelIncrement / 2);
            } else {
                pixelIncrement = 10;
            }

            lastHeight -= pixelIncrement;
            lastWidth -= pixelIncrement;

            console.log(`${new Date().toTimeString()} ${options.fileType}: Target ${options.targetLengthMB}MB ` +
                `Actual ${(buf.length / BytesInMB).toFixed(2)}MB - ${currentHeight}x${currentWidth} needs ${((targetLength - buf.length) / BytesInMB).toFixed(2)}MB, ` +
                `changing h/w -${pixelIncrement} to ${lastWidth}x${lastHeight}...`);
        } else {
            return buf;
        }
    }
};