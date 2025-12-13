'use client';
import MovieCard from '@/components/movies/MovieCard';
import { Suspense } from 'react';
import SearchAndFilter from '@/components/movies/SearchAndFilter';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const genre = searchParams.get('with_genres');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    if (genre && genre !== 'all') {
        params.with_genres = genre;
    }

    fetchTMDb<{ results: MovieResult[], total_pages: number }>
    (path, params)
      .then((data) => {
        setResults(data.results);
        setTotalPages(data.total_pages);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    performSearch(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, page]);


  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
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

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <Button 
                key={i} 
                variant={i === page ? 'default' : 'outline'} 
                onClick={() => setPage(i)}
                className="h-9 w-9 p-0"
            >
                {i}
            </Button>
        );
    }
    return pages;
  }


  return (
    <div className='space-y-8'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
        </div>
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
                <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                {renderPagination()}
                <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
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
          Search Movies
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
