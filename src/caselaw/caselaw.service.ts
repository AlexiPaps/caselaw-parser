import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseLawInput } from './dto/create-caselaw.input';

@Injectable()
export class CaseLawService {
    constructor(private prisma: PrismaService) { }

    async create(createCaseLawInput: CreateCaseLawInput) {
        return this.prisma.caseLaw.create({
            data: createCaseLawInput,
        });
    }

    async findOne(id: string) {
        return this.prisma.caseLaw.findUnique({ where: { id } });
    }

    async findUniqueByCaseNumberAndDate(caseNumber: number, dateOfDecision: string) {
        return this.prisma.caseLaw.findFirst({
            where: {
                caseNumber,
                dateOfDecision: new Date(dateOfDecision),
            },
        });
    }
}