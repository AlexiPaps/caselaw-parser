import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';
import { PdfService } from '../utils/pdf.service';
import { AiService } from '../utils/ai.service';
import { CaseLawModule } from '../caselaw/caselaw.module';

@Module({
    imports: [CaseLawModule],
    providers: [UploadResolver, UploadService, PdfService, AiService],
})
export class UploadModule { }
