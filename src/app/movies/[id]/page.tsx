
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Languages, Star, Youtube } from 'lucide-react';
import type { MovieDetails, TVDetails } from '@/lib/types';
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
import { useSearchParams } from 'next/navigation';

type DetailData = MovieDetails & TVDetails;

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'movie';

  const [details, setDetails] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      setLoading(true);
      const endpoint = `${type}/${params.id}?append_to_response=videos`;
      const data = await fetchTMDb<DetailData>(endpoint);
      setDetails(data);
      setLoading(false);
    }
    getDetails();
  }, [params.id, type]);

  if (loading || !details) {
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

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const runtime = details.runtime || (details.episode_run_time?.[0]);

  const posterUrl = details.poster_path
    ? getImageUrl(details.poster_path)
    : 'https://picsum.photos/seed/placeholder/500/750';
  const backdropUrl = details.backdrop_path
    ? getImageUrl(details.backdrop_path, 'w1280')
    : 'https://picsum.photos/seed/backdrop/1280/720';
  const releaseYear = releaseDate
    ? new Date(releaseDate).getFullYear()
    : 'N/A';
  const trailer = details.videos?.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const onNetflix = details.id % 2 === 0;
  
  const getSubtitleLanguages = () => {
    const baseLangs = ['English', 'Spanish'];
    const movieLangs = details.spoken_languages.slice(0, 2).map(l => l.english_name);
    const combined = [...new Set([...baseLangs, ...movieLangs])]; // Use Set to avoid duplicates
    return combined.join(', ');
  }


  return (
    <div className="space-y-12">
      <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 mt-[-1rem] sm:mt-[-1.5rem] lg:mt-[-2rem]">
        <Image
          src={backdropUrl}
          alt={`Backdrop for ${title}`}
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
                  {title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span>{releaseYear}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">
                      {details.vote_average.toFixed(1)}
                    </span>
                  </div>
                  {runtime && <span>{runtime} min</span>}
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
                alt={`Poster for ${title}`}
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
                {details.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-foreground/80">{details.overview}</p>
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
                        {details.spoken_languages.map((lang) => lang.english_name).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                    <Languages className="w-5 h-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">Subtitles</h3>
                      <p className="text-muted-foreground">
                        {getSubtitleLanguages()}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="mt-16">
          <MovieReviews movieId={String(details.id)} />
        </div>
      </div>
    </div>
  );
}
