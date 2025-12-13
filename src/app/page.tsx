
import { Suspense } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import MovieCard from '@/components/movies/MovieCard';
import HeroBanner from '@/components/movies/HeroBanner';
import { Recommendations } from '@/components/movies/Recommendations';
import SearchAndFilter from '@/components/movies/SearchAndFilter';
import { Clapperboard } from 'lucide-react';

async function MovieCarousel({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const { results: movies } = await fetchTMDb<{ results: MovieResult[] }>(path);

  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">
        {title}
      </h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
    </section>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
             <div className="flex items-center gap-2">
                <Clapperboard className="w-12 h-12 text-primary" />
                <h1 className="text-5xl font-bold font-headline text-primary">
                    Moviify
                </h1>
            </div>
            <p className="text-muted-foreground text-lg">
                Your ultimate guide to movie discovery.
            </p>
        </div>

       <div className="px-4 sm:px-6 lg:px-8">
         <Suspense fallback={<div className="h-12 w-full bg-secondary animate-pulse rounded-lg" />}>
           <SearchAndFilter />
         </Suspense>
       </div>

      <Suspense fallback={<div className="h-[50vh] bg-secondary animate-pulse rounded-lg" />}>
        <HeroBanner path="movie/popular" />
      </Suspense>

      <div className="space-y-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<p>Loading recommendations...</p>}>
            <div>
              <Recommendations />
            </div>
        </Suspense>

        <Suspense fallback={<p>Loading trending movies...</p>}>
          <MovieCarousel title="Trending Now" path="trending/movie/week" />
        </Suspense>
        
        <Suspense fallback={<p>Loading popular movies...</p>}>
          <MovieCarousel title="Popular Movies" path="movie/popular" />
        </Suspense>
        
        <Suspense fallback={<p>Loading latest releases...</p>}>
          <MovieCarousel title="Latest Releases" path="movie/now_playing" />
        </Suspense>
      </div>
    </div>
  );
}
