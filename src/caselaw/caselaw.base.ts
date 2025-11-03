import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('CaseLawBaseInput')
export class CaseLawBase {
    @Field()
    title: string;

    @Field()
    decisionType: string;

    @Field(() => Date)
    dateOfDecision: Date;

    @Field()
    office: string;

    @Field()
    court: string;

    @Field()
    caseNumber: string;

    @Field()
    summary: string;
}
