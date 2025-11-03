import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CaseLawService } from './caselaw.service';
import { CaseLaw } from './caselaw.model';
import { CreateCaseLawInput } from './dto/create-caselaw.input';

@Resolver(() => CaseLaw)
export class CaseLawResolver {
    constructor(private readonly caseLawService: CaseLawService) { }

    @Mutation(() => CaseLaw)
    createCaseLaw(@Args('createCaseLawInput') createCaseLawInput: CreateCaseLawInput) {
        return this.caseLawService.create(createCaseLawInput);
    }

    @Query(() => [CaseLaw], { name: 'caseLaws' })
    findAll() {
        return this.caseLawService.findAll();
    }

    @Query(() => CaseLaw, { name: 'caseLaw' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.caseLawService.findOne(id);
    }

    //// Query by caseNumber + dateOfDecision (assumes unique)
    // THOUGHTS:
    // I thought I might want to find documents based on something else than the id,
    // since the id doesnt say much about the data.
    // So i created this index and query - I assume it is a unique key so it only finds one.
    // I would need more knowledge about the actual data to determine if it is actually unique.
    // I could use @@unique([caseNumber, dateOfDecision]) in schema.prisma if it was actually unique
    // And I could use findUnique instead of findFirst in caselaw.service
    @Query(() => CaseLaw, { name: 'caseLawByCaseNumberAndDate', nullable: true })
    findUniqueByCaseNumberAndDate(
        @Args('caseNumber', { type: () => String }) caseNumber: string,
        @Args('dateOfDecision', { type: () => String }) dateOfDecision: string,
    ) {
        return this.caseLawService.findUniqueByCaseNumberAndDate(caseNumber, dateOfDecision);
    }
}