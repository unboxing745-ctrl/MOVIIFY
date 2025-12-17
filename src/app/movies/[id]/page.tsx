
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Youtube, Clapperboard, CalendarIcon, User, Video, Captions, Languages } from 'lucide-react';
import type { MovieDetails, TVDetails, Credits } from '@/lib/types';
import MovieReviews from '@/components/movies/MovieReviews';
import { useEffect, useState } from 'react';
import { fetchTMDb, getImageUrl } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useParams } from 'next/navigation';
import WhereToWatch from '@/components/movies/WhereToWatch';

type DetailData = (MovieDetails | TVDetails) & { credits: Credits };

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'movie';
  const type = typeParam === 'tv' ? 'tv' : 'movie';

  const [details, setDetails] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      if (!id) return;
      setLoading(true);
      const endpoint = `${type}/${id}?append_to_response=videos,credits`;
      try {
        const detailsData = await fetchTMDb<DetailData>(endpoint);
        setDetails(detailsData);
      } catch (error) {
        console.error("Failed to fetch details:", error);
      } finally {
        setLoading(false);
      }
    }
    getDetails();
  }, [id, type]);

  if (loading || !details) {
    return (
        <div className="container mx-auto px-4 py-8 pt-28">
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
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
                </div>
            </div>
             <div className='mt-12 space-y-4'>
                <Skeleton className="h-8 w-40" />
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

  const availableLanguages = details.spoken_languages?.map(l => l.english_name).join(', ') || '';

  const availableSubtitles = [
      ...(details.spoken_languages || []).slice(0, 2).map(l => l.english_name),
      'English',
      'Spanish',
      'French'
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 pt-28">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
            <div className="w-full">
                <div className="aspect-[2/3] w-full relative">
                    <Image
                        src={getImageUrl(details.poster_path, 'w500')}
                        alt={`Poster for ${title}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                </div>
            </div>
            <div className="space-y-6">
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
                            <Star className="w-5 h-5 text-amber-400" />
                             <span>{typeof details.vote_average === 'number' ? details.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>

                        <div className="flex items-center flex-wrap gap-2">
                            <Clapperboard className="w-5 h-5" />
                            {details.genres && details.genres.map((genre) => (
                            <Badge key={genre.id} variant="outline">
                                {genre.name}
                            </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            
                <p className="text-lg text-foreground/80">{details.overview}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                     <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Languages className="text-primary" />
                            Languages
                        </h2>
                        <p className="text-muted-foreground">{availableLanguages || 'Not specified'}</p>
                    </div>
                     <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Captions className="text-primary" />
                            Subtitles
                        </h2>
                        <p className="text-muted-foreground">{availableSubtitles.join(', ')}</p>
                    </div>
                </div>
                 <div className="pt-4">
                    <WhereToWatch tmdbId={details.id} type={type} />
                </div>
            </div>
        </div>

      {trailer && (
        <div className="space-y-4">
           <h2 className="text-2xl font-bold flex items-center gap-2">
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
