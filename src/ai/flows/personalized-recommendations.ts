'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized movie recommendations.
 *
 * - getPersonalizedRecommendations - A function that takes user preferences and returns movie recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewingHistory: z.array(
    z.string().describe('List of movie titles the user has watched')
  ).describe('The user viewing history.'),
  ratings: z.record(
    z.number().min(1).max(5)
  ).describe('A map of movie titles to user ratings (1-5).'),
  preferredGenres: z.array(
    z.string().describe('List of preferred movie genres')
  ).describe('The user preferred genres.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('Recommended movie titles')
  ).describe('A list of personalized movie recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert movie recommendation system. Given the user's viewing history, ratings, and preferred genres, you will provide a list of personalized movie recommendations.

Viewing History: {{viewingHistory}}
Ratings: {{ratings}}
Preferred Genres: {{preferredGenres}}

Based on this information, recommend movies the user is likely to enjoy.  Do not recommend movies already in the viewing history.

Format your output as a simple array of movie titles.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
