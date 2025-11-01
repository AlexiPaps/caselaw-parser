import { InputType } from '@nestjs/graphql';
import { CaseLawBase } from '../caselaw.base';

@InputType()
export class CreateCaseLawInput extends CaseLawBase { }
