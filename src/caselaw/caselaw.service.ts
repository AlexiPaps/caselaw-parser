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

    async findAll(params: { search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; skip?: number; take?: number }) {
        const { search, sortBy, sortOrder, skip, take } = params;
        return this.prisma.caseLaw.findMany({
            where: search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { summary: { contains: search, mode: 'insensitive' } },
                ],
            } : undefined,
            orderBy: sortBy ? { [sortBy]: sortOrder } : { dateOfDecision: 'desc' },
            skip,
            take,
        });
    }

    async findOne(id: string) {
        return this.prisma.caseLaw.findUnique({ where: { id } });
    }

    async findUniqueByCaseNumberAndDate(caseNumber: string, dateOfDecision: string) {
        return this.prisma.caseLaw.findFirst({
            where: {
                caseNumber,
                dateOfDecision: new Date(dateOfDecision),
            },
        });
    }
}