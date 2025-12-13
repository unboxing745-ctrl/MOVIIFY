import { Suspense } from 'react';
import { Clapperboard, Film, Sparkles } from 'lucide-react';
import MovieGrid from '@/components/movies/MovieGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/search/SearchBar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 lg:py-40 bg-background text-foreground">
           <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
           <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-4">
                 <Clapperboard className="w-16 h-16 text-primary" />
                 <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter text-primary">
                    MOVIIFY
                 </h1>
              </div>
              <p className="text-xl md:text-2xl text-foreground/80">
                Your Universe of Movies, Unlocked.
              </p>
              <div className="max-w-xl mx-auto">
                 <SearchBar />
              </div>
           </div>
        </section>

         <section className="py-8 md:py-16 px-4 md:px-8 lg:px-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-headline">
                Popular
              </h2>
            </div>
            <Suspense fallback={<div className="h-96 w-full bg-secondary animate-pulse rounded-lg" />}>
              <MovieGrid path="movie/popular" />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
