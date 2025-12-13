
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Languages, Star, Youtube, Clapperboard, CalendarIcon, User, Video } from 'lucide-react';
import type { MovieDetails, TVDetails, Credits } from '@/lib/types';
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
import { useSearchParams, useParams } from 'next/navigation';

type DetailData = (MovieDetails | TVDetails) & { credits: Credits };


export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'movie';

  const [details, setDetails] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      setLoading(true);
      const endpoint = `${type}/${id}?append_to_response=videos,credits`;
      try {
        const data = await fetchTMDb<DetailData>(endpoint);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
        getDetails();
    }
  }, [id, type]);

  if (loading || !details) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-8">
            <div className='space-y-2'>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-40" />
            </div>
             <div className='space-y-2'>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
         <div className='space-y-2'>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="aspect-video w-full" />
        </div>
      </div>
    );
  }

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  const director = details.credits?.crew?.find(p => p.job === 'Director');
  const cast = details.credits?.cast?.slice(0, 5);

  const trailer = details.videos?.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
             <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight mb-4">
                  {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{releaseYear}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>{details.vote_average.toFixed(1)}</span>
                </div>
                 <div className="flex items-center flex-wrap gap-2">
                    <Clapperboard className="w-5 h-5" />
                    {details.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline">
                        {genre.name}
                      </Badge>
                    ))}
              </div>
            </div>
        </div>
      
      <p className="text-lg text-foreground/80">{details.overview}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {director && (
            <div className="space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Video className="text-primary" />
                    Director
                </h2>
                <p className="text-muted-foreground">{director.name}</p>
            </div>
        )}
        {cast && cast.length > 0 && (
            <div className="space-y-2">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-primary" />
                    Cast
                </h2>
                <p className="text-muted-foreground">{cast.map(c => c.name).join(', ')}</p>
            </div>
        )}
      </div>

       <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Languages className="text-primary" />
                Languages
            </h2>
            <p className="text-muted-foreground">{details.spoken_languages.map(l => l.english_name).join(', ')}</p>
        </div>

      {trailer && (
        <div className="space-y-4">
           <h2 className="text-xl font-bold flex items-center gap-2">
                <Youtube className="text-primary" />
                Trailer
            </h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      <div className="pt-8">
        <MovieReviews movieId={String(details.id)} />
      </div>

    </div>
  );
}
