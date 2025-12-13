import Image from 'next/image';
import { fetchTMDb, getImageUrl } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Info, PlayCircle } from 'lucide-react';

export default async function HeroBanner({ path }: { path: string }) {
  const { results } = await fetchTMDb<{ results: MovieResult[] }>(path);
  const featuredMovie = results[Math.floor(Math.random() * 10)]; // Pick one of the top 10

  if (!featuredMovie || !featuredMovie.backdrop_path) {
    return (
      <div className="h-[50vh] bg-secondary flex items-center justify-center rounded-lg">
        <p>Could not load featured movie.</p>
      </div>
    );
  }

  const backdropUrl = getImageUrl(featuredMovie.backdrop_path, 'w1280');
  const releaseYear = new Date(featuredMovie.release_date).getFullYear();

  return (
    <div className="relative h-[50vh] w-full rounded-lg overflow-hidden">
      <Image
        src={backdropUrl}
        alt={`Backdrop for ${featuredMovie.title}`}
        fill
        className="object-cover object-center"
        priority
        data-ai-hint="movie background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-white shadow-lg">
            {featuredMovie.title}
          </h1>
          <div className="flex items-center gap-4 text-lg text-neutral-300">
            <span>{releaseYear}</span>
            <span className="border border-neutral-400 px-2 py-0.5 text-sm rounded">
              {featuredMovie.vote_average.toFixed(1)}
            </span>
          </div>
          <p className="text-neutral-200 line-clamp-3">
            {featuredMovie.overview}
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" asChild>
              <Link href={`/movies/${featuredMovie.id}`}>
                <PlayCircle className="mr-2" />
                Play Trailer
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/movies/${featuredMovie.id}`}>
                <Info className="mr-2" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
