'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Languages, Star, Youtube } from 'lucide-react';
import type { MovieDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { NetflixLogo } from '@/components/icons/NetflixLogo';
import MovieReviews from '@/components/movies/MovieReviews';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useEffect, useState } from 'react';
import { fetchTMDb, getImageUrl } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMovie() {
      setLoading(true);
      const movieData = await fetchTMDb<MovieDetails>(
        `movie/${params.id}?append_to_response=videos`
      );
      setMovie(movieData);
      setLoading(false);
    }
    getMovie();
  }, [params.id]);

  if (loading || !movie) {
    return (
      <div className="space-y-12">
        <Skeleton className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 mt-[-1rem] sm:mt-[-1.5rem] lg:mt-[-2rem]" />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-1 -mt-32 relative z-10">
              <Skeleton className="aspect-[2/3] relative rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path)
    : 'https://picsum.photos/seed/placeholder/500/750';
  const backdropUrl = movie.backdrop_path
    ? getImageUrl(movie.backdrop_path, 'w1280')
    : 'https://picsum.photos/seed/backdrop/1280/720';
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  const trailer = movie.videos?.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const onNetflix = movie.id % 2 === 0;
  const subtitleCount = movie.spoken_languages.length + 3;

  return (
    <div className="space-y-12">
      <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 mt-[-1rem] sm:mt-[-1.5rem] lg:mt-[-2rem]">
        <Image
          src={backdropUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover object-top"
          priority
          data-ai-hint="movie background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 text-white">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-white shadow-lg">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span>{releaseYear}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span>{movie.runtime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1 -mt-32 relative z-10">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={posterUrl}
                alt={`Poster for ${movie.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                data-ai-hint="movie poster"
              />
            </div>
            {trailer && (
              <Button asChild className="w-full mt-4">
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2" />
                  Watch Trailer
                </a>
              </Button>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-foreground/80">{movie.overview}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Availability</h3>
              <div className="flex flex-wrap items-center gap-4">
                {onNetflix ? (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
                    <NetflixLogo className="w-6 h-6" />
                    <span className="font-semibold">Netflix</span>
                    <Badge variant="outline">Paid</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
                    <Youtube className="w-6 h-6 text-red-500" />
                    <span className="font-semibold">YouTube</span>
                    <Badge
                      variant="outline"
                      className="bg-green-600/20 text-green-400 border-green-500/30"
                    >
                      Free
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  Show Details
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mt-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <Languages className="w-5 h-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Languages</h3>
                      <p className="text-muted-foreground">
                        {movie.spoken_languages.map((lang) => lang.english_name).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <Languages className="w-5 h-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Subtitles</h3>
                      <p className="text-muted-foreground">
                        {subtitleCount} languages
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="mt-16">
          <MovieReviews movieId={String(movie.id)} />
        </div>
      </div>
    </div>
  );
}
