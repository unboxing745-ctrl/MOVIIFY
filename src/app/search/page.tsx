'use client';
import MovieCard from '@/components/movies/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Film } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchTMDb<{ results: MovieResult[] }>('search/movie', { query })
        .then((data) => {
          setResults(data.results);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full" />
        ))}
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">No results found for "{query}"</h2>
        <p className="text-muted-foreground mt-2">
          Try searching for something else.
        </p>
      </div>
    );
  }

  if (!query) {
    return (
        <div className="text-center py-16 text-muted-foreground">
            <Film className="mx-auto h-12 w-12 mb-4" />
            <p>Search for a movie to get started.</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('q') as string;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="search"
        name="q"
        placeholder="Search for a movie, actor, genre..."
        className="flex-1 text-base"
        defaultValue={defaultQuery}
        aria-label="Search movies"
      />
      <Button type="submit" size="lg" aria-label="Search">
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </form>
  );
}

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline mb-4">
          Discover Movies
        </h1>
        <Suspense fallback={<Skeleton className="h-11 w-full" />}>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
