import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
    async extractCaseLawFields(text: string) {
        // Mock implementation for now
        // Later, send 'text' to OpenAI API and parse JSON response
        return {
            title: 'Mock Title',
            decisionType: 'Mock Type',
            dateOfDecision: new Date(),
            office: 'Mock Office',
            court: 'Mock Court',
            caseNumber: "1",
            summary: 'Mock summary',
        };
    }
}
