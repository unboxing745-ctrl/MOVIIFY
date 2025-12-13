'use client';

import { useState, useEffect } from 'react';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import type { MovieResult } from '@/lib/types';
import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTMDb } from '@/lib/tmdb';

// Mock user data for demonstration
const mockUserData = {
  viewingHistory: ['The Shawshank Redemption', 'The Godfather'],
  ratings: { 'The Shawshank Redemption': 5, 'The Godfather': 4 },
  preferredGenres: ['Drama', 'Crime'],
};

async function getMoviesByTitles(titles: string[]): Promise<MovieResult[]> {
    const moviePromises = titles.map(async (title) => {
        const searchResults = await fetchTMDb<{ results: MovieResult[] }>('search/movie', { query: title });
        return searchResults.results[0];
    });
    const movies = await Promise.all(moviePromises);
    return movies.filter(Boolean); // Filter out any null/undefined results
}


export function Recommendations() {
  const [recommendations, setRecommendations] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const result = await getPersonalizedRecommendations(mockUserData);
        const recommendedMovies = await getMoviesByTitles(result.recommendations);
        setRecommendations(recommendedMovies);
      } catch (e) {
        setError('Could not fetch recommendations.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold font-headline mb-6">For You</h2>
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-destructive">{error}</p>}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
       {!loading && !error && recommendations.length === 0 && (
        <p className="text-muted-foreground">No recommendations found at this time.</p>
       )}
    </section>
  );
}
