'use server';

/**
 * @fileOverview Summarizes the sentiment of movie reviews.
 *
 * - summarizeReviewSentiment - A function that summarizes the sentiment of movie reviews.
 * - SummarizeReviewSentimentInput - The input type for the summarizeReviewSentiment function.
 * - SummarizeReviewSentimentOutput - The return type for the summarizeReviewSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReviewSentimentInputSchema = z.object({
  reviews: z
    .string()
    .describe('The reviews of the movie.'),
});
export type SummarizeReviewSentimentInput = z.infer<typeof SummarizeReviewSentimentInputSchema>;

const SummarizeReviewSentimentOutputSchema = z.object({
  summary: z.string().describe('A summary of the sentiment expressed in the movie reviews.'),
});
export type SummarizeReviewSentimentOutput = z.infer<typeof SummarizeReviewSentimentOutputSchema>;

export async function summarizeReviewSentiment(input: SummarizeReviewSentimentInput): Promise<SummarizeReviewSentimentOutput> {
  return summarizeReviewSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReviewSentimentPrompt',
  input: {schema: SummarizeReviewSentimentInputSchema},
  output: {schema: SummarizeReviewSentimentOutputSchema},
  prompt: `You are an expert movie critic. Please provide a brief summary of the general sentiment expressed in the following movie reviews:\n\n{{{reviews}}}`,
});

const summarizeReviewSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeReviewSentimentFlow',
    inputSchema: SummarizeReviewSentimentInputSchema,
    outputSchema: SummarizeReviewSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
