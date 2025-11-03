
/**
 * Splits large text into overlapping chunks for LLM processing.
 *
 * @param text - The full input text.
 * @param maxChunkSize - Maximum size (in characters) for each chunk.
 * @param overlap - Number of characters to overlap between chunks (to preserve context).
 * @returns An array of text chunks.
 */
export function splitIntoChunks(
    text: string,
    maxChunkSize = 10000,
    overlap = 500
): string[] {
    if (!text) return [];

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        let end = start + maxChunkSize;

        // Try to end the chunk at a sentence boundary if possible
        if (end < text.length) {
            const lastPeriod = text.lastIndexOf('.', end);
            if (lastPeriod > start + maxChunkSize * 0.6) {
                end = lastPeriod + 1;
            }
        }

        const chunk = text.slice(start, end).trim();
        chunks.push(chunk);

        // Move the start forward, keeping overlap
        start = end - overlap;
    }

    return chunks;
}