'use client';
import MovieCard from '@/components/movies/MovieCard';
import { Suspense } from 'react';
import SearchAndFilter from '@/components/movies/SearchAndFilter';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Film } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const genre = searchParams.get('with_genres');
  const year = searchParams.get('primary_release_year');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const performSearch = (pageNum: number) => {
    setLoading(true);
    let path = 'discover/movie';
    const params: Record<string, string> = {
        sort_by: 'popularity.desc',
        page: String(pageNum)
    };

    if (query) {
        path = 'search/movie';
        params.query = query;
    }
    if (genre) {
        params.with_genres = genre;
    }
    if (year) {
        params.primary_release_year = year;
    }

    fetchTMDb<{ results: MovieResult[], total_pages: number }>
    (path, params)
      .then((data) => {
        setResults(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
        setHasMore(pageNum < data.total_pages);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1);
    setResults([]);
    performSearch(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, year]);

  useEffect(() => {
    if (page > 1) {
        performSearch(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);


  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">No results found</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }


  return (
    <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
        </div>
        {loading && <div className="text-center py-8">Loading more...</div>}
        {!loading && hasMore && (
            <div className="text-center py-8">
                <button onClick={() => setPage(p => p + 1)} className="text-primary hover:underline">Load More</button>
            </div>
        )}
    </div>
  );
}


export default function SearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline mb-4">
          Discover Movies
        </h1>
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <SearchAndFilter />
        </Suspense>
      </div>

      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
