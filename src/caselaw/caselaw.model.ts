import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CaseLawBase } from './caselaw.base';

@ObjectType()
export class CaseLaw extends CaseLawBase {
    @Field(() => ID)
    id: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}
