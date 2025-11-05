import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { FileParserService } from '../file-parser/file-parser.service';
import { AiService } from '../ai/ai.service';
import { CaseLawService } from '../caselaw/caselaw.service';

@Injectable()
export class UploadService {
    constructor(
        private readonly fileParserService: FileParserService,
        private readonly aiService: AiService,
        private readonly caseLawService: CaseLawService,
    ) { }

    async handleUpload(file: FileUpload) {
        // 1. Save the file temporarily
        const filePath = await this.fileParserService.saveTempFile(file);

        // 2. Extract text from the file
        const chunks = await this.fileParserService.extractText(filePath);

        // 3. Send chunks of text to AI for field extraction
        const extractedFields = await this.aiService.extractCaseLawFields(chunks);

        // 4. Save the extracted fields to DB
        const caseLaw = await this.caseLawService.create(extractedFields);

        // 5. Remove the temp file
        await this.fileParserService.cleanupTempFile(filePath);

        return caseLaw;
    }
}
