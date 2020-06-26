import { GenerateOptions, generateRandomBuffer } from "..";
import { FileTypeHandlerBase } from "./abstraction/fileTypeHandlerBase";
import officegen = require("officegen");
import { WritableStream } from "memory-streams";
import { createWriteStream } from "fs";

export class PPTXFileTypeHandler implements FileTypeHandlerBase {
    async Handle(options: GenerateOptions): Promise<Buffer> {
        let bufs: Buffer[] = [];
        return new Promise((resolve, reject) => {
            console.log("promise started");
            const pptx = officegen("pptx");
            let slide = pptx.makeTitleSlide('Officegen', 'Example to a PowerPoint document')
 
            // Pie chart slide example:
             
            slide = pptx.makeNewSlide()
            slide.name = 'Pie Chart slide'
            slide.back = 'ffff00'
            slide.addChart(
              {
                title: 'My production',
                renderType: 'pie',
                data:
                [
                  {
                    name: 'Oil',
                    labels: ['Czech Republic', 'Ireland', 'Germany', 'Australia', 'Austria', 'UK', 'Belgium'],
                    values: [301, 201, 165, 139, 128,  99, 60],
                    colors: ['ff0000', '00ff00', '0000ff', 'ffff00', 'ff00ff', '00ffff', '000000']
                  }
                ]
              }
            )
             
            let out = createWriteStream('example.pptx')

            pptx.on('error', function (err) {
                console.log(err);
                reject(err)
            });

            out.on('error', function (err) {
                console.log(err);
                reject(err)
            });

            out.on('close', () => {
                console.log("end");
                resolve(Buffer.alloc(0))
            });

            console.log("generating");
            pptx.generate(out);
        })
    }
}