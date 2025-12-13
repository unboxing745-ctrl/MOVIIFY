import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import MovieCard from './MovieCard';
import { Skeleton } from '../ui/skeleton';

export default async function MovieGrid({ path, horizontal = false }: { path: string, horizontal?: boolean }) {
  const { results } = await fetchTMDb<{ results: MovieResult[] }>(path);

  if (!results || results.length === 0) {
    if (horizontal) {
        return (
            <div className="flex space-x-6 overflow-x-auto pb-4 horizontal-scroll-container">
                 {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-48 space-y-2">
                        <Skeleton className="aspect-[2/3] w-full" />
                        <Skeleton className="h-5 w-4/5" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                 ))}
            </div>
        )
    }
    return (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-4/5" />
                 <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
    );
  }
  
  if (horizontal) {
    return (
        <div className="flex space-x-6 overflow-x-auto pb-4 horizontal-scroll-container">
            {results.slice(0, 15).map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-48">
                    <MovieCard movie={movie} />
                </div>
            ))}
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
