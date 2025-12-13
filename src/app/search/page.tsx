
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/movies/MovieCard';
import { useSearchMovies } from '@/hooks/use-search-movies';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { fetchTMDb } from '@/lib/tmdb';
import type { Genre } from '@/lib/types';
import { useEffect, useState } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreId = searchParams.get('with_genres') || '';
  const sortBy = searchParams.get('sort_by') || '';
  
  const [genres, setGenres] = useState<Genre[]>([]);
  useEffect(() => {
    fetchTMDb<{ genres: Genre[] }>('genre/movie/list').then((data) => {
      setGenres(data.genres);
    });
  }, []);

  const { movies, loading, error, hasMore, loadMore } = useSearchMovies(
    query,
    genreId,
    sortBy
  );

  const getTitle = () => {
    if (query) return `Search results for "${query}"`;
    if (genreId) {
        const genre = genres.find(g => String(g.id) === genreId);
        return genre ? `${genre.name} Movies` : 'Discover Movies';
    }
    if (sortBy === 'vote_average.desc') return 'Top Rated Movies';
    return 'Discover Movies';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-headline">{getTitle()}</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {loading && movies.length === 0
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-4/5" />
                 <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {loading && movies.length > 0 && <p className='text-center text-muted-foreground'>Loading more...</p>}

      {!loading && movies.length === 0 && (
         <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No results found. Try a different search.</p>
        </div>
      )}

      {hasMore && !loading && movies.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading search results...</div>}>
            <SearchResults />
        </Suspense>
    )
}
