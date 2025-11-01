import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { PdfService } from '../utils/pdf.service';
import { AiService } from '../utils/ai.service';
import { CaseLawService } from '../caselaw/caselaw.service';

@Injectable()
export class UploadService {
    constructor(
        private readonly pdfService: PdfService,
        private readonly aiService: AiService,
        private readonly caseLawService: CaseLawService,
    ) { }

    async handleUpload(file: FileUpload) {
        // 1. Save the PDF temporarily - maybe?
        const filePath = await this.pdfService.saveTempFile(file);

        // 2. Extract text from PDF
        const text = await this.pdfService.extractText(filePath);

        // 3. Send text to AI for field extraction
        const extractedFields = await this.aiService.extractCaseLawFields(text);

        // 4. Save the extracted fields to DB
        const caseLaw = await this.caseLawService.create(extractedFields);

        // 5. Optionally, remove the temp file
        await this.pdfService.cleanupTempFile(filePath);

        return caseLaw;
    }
}
