import { searchMovies } from '@/lib/data';
import MovieCard from '@/components/movies/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline mb-4">Discover Movies</h1>
        <form action="/search" className="flex gap-2">
          <Input
            type="search"
            name="q"
            placeholder="Search for a movie, actor, genre..."
            className="flex-1 text-base"
            defaultValue={query}
            aria-label="Search movies"
          />
          <Button type="submit" size="lg" aria-label="Search">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>
      </div>

      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const results = searchMovies(query);

  if (query && results.length === 0) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No results found for "{query}"</h2>
            <p className="text-muted-foreground mt-2">Try searching for something else.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
