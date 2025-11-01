import { Resolver, Mutation, Args } from '@nestjs/graphql';
import type { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts';
import { UploadService } from './upload.service';
import { CaseLaw } from '../caselaw/caselaw.model';

@Resolver()
export class UploadResolver {
    constructor(private readonly uploadService: UploadService) { }

    @Mutation(() => CaseLaw)
    async uploadCaseLaw(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUpload,
    ): Promise<CaseLaw> {
        return this.uploadService.handleUpload(file);
    }
}

