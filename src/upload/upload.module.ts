import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';
import { FileParserModule } from '../file-parser/file-parser.module';
import { AiModule } from '../ai/ai.module';
import { CaseLawModule } from '../caselaw/caselaw.module';

@Module({
    imports: [FileParserModule, AiModule, CaseLawModule],
    providers: [UploadResolver, UploadService],
})
export class UploadModule { }