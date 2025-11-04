import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, IsDateString } from 'class-validator';

@InputType('CaseLawBaseInput')
@ObjectType()
export class CaseLawBase {
    @Field()
    @IsString()
    title: string;

    @Field()
    @IsString()
    decisionType: string;

    @Field(() => Date)
    @IsDateString()
    dateOfDecision: Date;

    @Field()
    @IsString()
    office: string;

    @Field()
    @IsString()
    court: string;

    @Field()
    @IsString()
    caseNumber: string;

    @Field()
    @IsString()
    summary: string;
}
