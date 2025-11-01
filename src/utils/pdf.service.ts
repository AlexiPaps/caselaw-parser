import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { FileUpload } from 'graphql-upload-ts';

import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfService {
    private readonly tmpDir = path.join(__dirname, '../../tmp');

    async saveTempFile(file: FileUpload): Promise<string> {
        if (!fs.existsSync(this.tmpDir)) fs.mkdirSync(this.tmpDir, { recursive: true });

        const filePath = path.join(this.tmpDir, file.filename);
        const writeStream = fs.createWriteStream(filePath);
        await new Promise<void>((resolve, reject) =>
            file.createReadStream().pipe(writeStream)
                .on('finish', () => resolve())
                .on('error', (err) => reject(err))
        );

        return filePath;
    }

    async extractText(filePath: string): Promise<string> {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText({ parsePageInfo: true });
        let text = "";
        if (result && result.pages.length > 0) {
            for (let i = 0; i <= result.pages.length; i++) {
                text += result.getPageText(i);
            }
        }
        console.log(text);
        // console.log(result);
        return text;
    }

    async cleanupTempFile(filePath: string) {
        fs.unlinkSync(filePath);
    }
}