import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { FileUpload } from 'graphql-upload-ts';
import { PDFParse } from 'pdf-parse';
import * as cheerio from 'cheerio';
import { splitIntoChunks } from 'src/utils/chunk-text.util';

@Injectable()
export class FileParserService {
    private readonly tmpDir = path.join(__dirname, '../../../tmp');

    async saveTempFile(file: FileUpload): Promise<string> {
        if (!fs.existsSync(this.tmpDir)) fs.mkdirSync(this.tmpDir, { recursive: true });

        const filePath = path.join(this.tmpDir, file.filename);
        const writeStream = fs.createWriteStream(filePath);

        await new Promise<void>((resolve, reject) => {
            file.createReadStream()
                .pipe(writeStream)
                .on('finish', () => resolve())
                .on('error', (err) => reject(err));
        });

        return filePath;
    }

    async extractText(filePath: string): Promise<string[]> {
        const ext = path.extname(filePath).toLowerCase();

        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: dataBuffer });
            const result = await parser.getText({ parsePageInfo: true });
            let text = "";
            if (result && result.pages.length > 0) {
                for (let i = 0; i <= result.pages.length; i++) {
                    text += result.getPageText(i);
                }
            }

            const chunks = splitIntoChunks(text);

            return chunks;
        }

        if (ext === '.html' || ext === '.htm') {
            // 1. Load html file
            const html = fs.readFileSync(filePath, 'utf-8');
            const $ = cheerio.load(html);

            // 2. Remove noise
            $('script, style, noscript, iframe, svg').remove();

            // 3. Extract text content
            const text = $.text().replace(/\s+/g, ' ').trim();

            // 4. Split into chunks
            const chunks = splitIntoChunks(text);

            return chunks;
        }

        throw new BadRequestException('Unsupported file type. Only .pdf and .html are allowed.');
    }

    async cleanupTempFile(filePath: string) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.warn(`Could not delete temp file ${filePath}:`, err.message);
        }
    }
}