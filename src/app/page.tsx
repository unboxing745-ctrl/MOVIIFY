import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import MovieGrid from '@/components/movies/MovieGrid';

export default function Home() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">
                New Releases
            </h1>
        </div>
      <Suspense fallback={<div className="h-96 w-full bg-secondary animate-pulse rounded-lg" />}>
        <MovieGrid path="movie/popular" />
      </Suspense>
    </div>
  );
}
