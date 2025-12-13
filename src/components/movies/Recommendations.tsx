'use client';

import { useState, useEffect } from 'react';
import type { MovieResult } from '@/lib/types';
import MovieCard from './MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchTMDb } from '@/lib/tmdb';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


export function Recommendations() {
  const [recommendations, setRecommendations] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const popularMoviesData = await fetchTMDb<{ results: MovieResult[] }>('discover/movie');
        
        // Take top 12 movies and shuffle them
        const shuffledMovies = shuffleArray(popularMoviesData.results.slice(0, 12));
        
        setRecommendations(shuffledMovies);
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
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-4 w-4/5" />
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
