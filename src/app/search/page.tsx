
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/movies/MovieCard';
import { useSearchMovies } from '@/hooks/use-search-movies';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SearchAndFilter from '@/components/movies/SearchAndFilter';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('with_genres') || '';

  const { movies, loading, error, hasMore, loadMore } = useSearchMovies(
    query,
    genre
  );

  const getTitle = () => {
    if (query) return `Search results for "${query}"`;
    if (genre) return `Discover Movies`;
    return 'Discover Movies';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-headline">{getTitle()}</h1>
        <div className="px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <SearchAndFilter />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading && movies.length === 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {loading && movies.length > 0 && <p className='text-center text-muted-foreground'>Loading more...</p>}

      {!loading && movies.length === 0 && (
         <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No movies found. Try a different search.</p>
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
