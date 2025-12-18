'use client'; // ensure this page is treated as a client component

import { Suspense } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import MovieGrid from '@/components/movies/MovieGrid';
import SearchBar from '@/components/search/SearchBar';
import { MoviifyLogo } from '@/components/icons/MoviifyLogo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-screen bg-background text-foreground">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="relative z-10 space-y-6 px-4">
            <MoviifyLogo className="w-96 md:w-[32rem] h-auto text-primary mx-auto" />
            <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
              <p className="text-xl md:text-2xl text-foreground/80">
                Discover your next favorite film.
              </p>
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Trending & Recommendations */}
        <section className="py-8 md:py-16 px-4 md:px-8 lg:px-16 space-y-12">
          {/* Trending */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-headline">
                Trending
              </h2>
            </div>
            <Suspense
              fallback={
                <div className="h-96 w-full bg-secondary animate-pulse rounded-lg" />
              }
            >
              <MovieGrid path="trending/movie/week" horizontal={true} />
            </Suspense>
          </div>

          {/* Recommendations */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-headline">
                Recommendation
              </h2>
            </div>
            <Suspense
              fallback={
                <div className="h-96 w-full bg-secondary animate-pulse rounded-lg" />
              }
            >
              <MovieGrid path="trending/all/week" />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

