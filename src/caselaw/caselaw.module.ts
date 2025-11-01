import { Module } from '@nestjs/common';
import { CaseLawService } from './caselaw.service';
import { CaseLawResolver } from './caselaw.resolver';

@Module({
  providers: [CaseLawResolver, CaseLawService],
  exports: [CaseLawService]
})
export class CaseLawModule { }