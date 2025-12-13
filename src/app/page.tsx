
import { Suspense } from 'react';
import SearchAndFilter from '@/components/movies/SearchAndFilter';
import { Clapperboard } from 'lucide-react';
import { Recommendations } from '@/components/movies/Recommendations';

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
       
       <div className="px-4 sm:px-6 lg:px-8">
        <Suspense>
            <Recommendations />
        </Suspense>
       </div>
    </div>
  );
}
