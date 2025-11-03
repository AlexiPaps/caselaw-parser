import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async extractMetadata(text: string) {
        const systemPrompt = `
You are an expert legal text parser. Extract the following metadata from the document:

-"title": "string (the official CJEU title of the case... casenumber, name)",
-"dateOfDecision": "date (the date of the decision in YYYY-MM-DD format)",
-"decisionType": "string (the decision type)",
-"office": "string (referring court)",
-"court": "string (deciding court)",
-"caseNumber": "string (casenumber)"

Return ONLY a valid JSON object.
`;

        const userPrompt = `
Text:
"""${text}"""
`;

        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });

        return JSON.parse(res.choices[0].message?.content || "{}");
    }

    async summarizeChunk(chunk: string): Promise<string> {
        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: `Summarize this section in 2–4 sentences. Focus on key facts, decisions, and outcomes. Keep legal terms.`
                },
                { role: "user", content: chunk }
            ]
        });
        return (res.choices[0].message?.content?.trim() || "");
    }


    async finalSummary(chunkSummaries: string[]): Promise<string> {
        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `You are given summaries of different sections of a legal/administrative document.
                        Create ONE concise, coherent summary (4–8 sentences) of the entire case.
                        Preserve: case number, parties, key dates, decision, and outcome.
                        Structure: Background → Dispute → Decision → Consequences.`
                },
                {
                    role: "user",
                    content: chunkSummaries.map((s, i) => `--- Section ${i + 1} ---\n${s}`).join("\n\n")
                }
            ]
        });

        return (res.choices[0].message?.content?.trim() || "No Summary");
    }

    async extractCaseLawFields(chunks: string[]) {
        const metadata = await this.extractMetadata(chunks[0]);
        const chunkSummaries = await Promise.all(chunks.map(chunk => this.summarizeChunk(chunk)));
        const summary = await this.finalSummary(chunkSummaries);

        // make sure the decision date is iso datetime
        const input = metadata.dateOfDecision;
        const iso = new Date(input.replace(/(\d+)\/([A-Z]{3})\/(\d{4})/, '$1 $2 $3') + ' UTC').toISOString();
        metadata.dateOfDecision = iso;

        const result = {
            ...metadata,
            summary
        }
        console.log('result: ', result)

        return result;
    }
}
