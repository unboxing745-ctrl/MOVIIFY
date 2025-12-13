
import { Suspense } from 'react';
import SearchAndFilter from '@/components/movies/SearchAndFilter';
import { Clapperboard } from 'lucide-react';
import { Recommendations } from '@/components/movies/Recommendations';
import UserAuth from '@/components/layout/UserAuth';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <header className="flex justify-end p-4">
        <UserAuth />
      </header>
      <main className="flex flex-col flex-1 items-center justify-center -mt-16">
        <div className="w-full max-w-3xl space-y-8 px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
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
          <Suspense fallback={<div className="h-12 w-full bg-secondary animate-pulse rounded-lg" />}>
            <SearchAndFilter />
          </Suspense>
        </div>
      </main>

       <div className="px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense>
            <Recommendations />
        </Suspense>
       </div>
    </div>
  );
}
