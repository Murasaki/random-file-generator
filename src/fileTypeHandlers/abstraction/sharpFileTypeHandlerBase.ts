import { FileTypeHandlerBase } from "./fileTypeHandlerBase";
import { GenerateOptions, SharpFileTypeCallback, generateRandomImageBuffer, SharpFileTypes } from "../../index";
import { BytesInMB } from "../../constants";


/** A lookup for each of the supported file types that are images, 
 * the value looked up is a callback after instantiating a raw image buffer with sharp to specify file type */
export const defaultCallbacks: { [fileType in SharpFileTypes]: SharpFileTypeCallback; } = {
    /** The default callback for png, calls sharp.png() with no options */
    PNG: img => img.png(),

    /** The default callback for jpeg, calls sharp.jpeg() with no options */
    JPEG: img => img.jpeg(),

    /** The default callback for tiff, calls sharp.tiff() with no options */
    TIFF: img => img.tiff()
}

export class SharpFileTypeHandlerBase extends FileTypeHandlerBase {
    static async HandleSharpImage(options: GenerateOptions) {
        if (!options.sharpFileTypeCallback) {
            options.sharpFileTypeCallback = defaultCallbacks[options.fileType.toUpperCase()]
        }

        if (!options.maxDegreeOfInaccuracyInBytes) {
            options.maxDegreeOfInaccuracyInBytes = BytesInMB / 4;
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
            /* istanbul ignore if  */
            else if (buf.length >= (targetLength + options.maxDegreeOfInaccuracyInBytes)) {
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
    }
}