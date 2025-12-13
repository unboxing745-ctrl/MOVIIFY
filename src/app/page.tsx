import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { getTrendingMovies } from '@/lib/data';
import MovieCard from '@/components/movies/MovieCard';
import { Recommendations } from '@/components/movies/Recommendations';

export default function Home() {
  const trendingMovies = getTrendingMovies();

  return (
    <div className="space-y-12">
      <section className="text-center bg-card p-8 rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Find Your Next Favorite Movie
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Search, review, and get personalized recommendations for thousands of
          titles.
        </p>
        <form
          action="/search"
          className="mt-8 max-w-xl mx-auto flex gap-2"
        >
          <Input
            type="search"
            name="q"
            placeholder="Search for a movie, actor, genre..."
            className="flex-1 text-base"
            aria-label="Search movies"
          />
          <Button type="submit" size="lg" aria-label="Search">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">
          Trending Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <Recommendations />
    </div>
  );
}
