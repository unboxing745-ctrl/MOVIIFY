
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Youtube, Clapperboard, CalendarIcon, User, Video, Captions, Languages } from 'lucide-react';
import type { MovieDetails, TVDetails, Credits, WatchProviders, WatchProviderDetails } from '@/lib/types';
import MovieReviews from '@/components/movies/MovieReviews';
import { useEffect, useState } from 'react';
import { fetchTMDb, getImageUrl } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams, useParams } from 'next/navigation';
import { NetflixLogo } from '@/components/icons/NetflixLogo';
import Link from 'next/link';

type DetailData = (MovieDetails | TVDetails) & { credits: Credits; 'watch/providers': { results: WatchProviders } };

type UnifiedProvider = WatchProviderDetails & { type: 'Stream' | 'Rent' | 'Buy' };

type GroupedProvider = WatchProviderDetails & { 
  types: ('Stream' | 'Rent' | 'Buy')[],
  country: string;
};


export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'movie';

  const [details, setDetails] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      if (!id) return;
      setLoading(true);
      const endpoint = `${type}/${id}?append_to_response=videos,credits,watch/providers`;
      try {
        const data = await fetchTMDb<DetailData>(endpoint);
        setDetails(data);
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

  const watchProviderResults = details['watch/providers']?.results;
  
  let watchLink = '#';
  const groupedProviders = new Map<string, GroupedProvider>();

  if (watchProviderResults) {
    Object.entries(watchProviderResults).forEach(([country, countryProviders]) => {
      if (countryProviders.link && watchLink === '#') {
        watchLink = countryProviders.link;
      }
      
      const processProviders = (providers: WatchProviderDetails[] | undefined, type: 'Stream' | 'Rent' | 'Buy') => {
        providers?.forEach(p => {
          // Normalize Amazon provider names
          const providerName = p.provider_name.includes('Amazon') ? 'Amazon Prime Video' : p.provider_name;
          const providerKey = `${providerName}-${country}`; // Group by name and country

          if (groupedProviders.has(providerKey)) {
            const existing = groupedProviders.get(providerKey)!;
            if (!existing.types.includes(type)) {
              existing.types.push(type);
            }
          } else {
            groupedProviders.set(providerKey, { ...p, provider_name: providerName, types: [type], country });
          }
        });
      };

      processProviders(countryProviders.flatrate, 'Stream');
      processProviders(countryProviders.rent, 'Rent');
      processProviders(countryProviders.buy, 'Buy');
    });
  }
  
  const uniqueProviders = Array.from(groupedProviders.values());
  uniqueProviders.sort((a, b) => (a.display_priority || Infinity) - (b.display_priority || Infinity));


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
            </div>
        </div>

        <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
                <Video className="text-primary" />
                Where to Watch
            </h2>
            {uniqueProviders.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {uniqueProviders.map(p => (
                         <a 
                           key={`${p.provider_id}-${p.country}`} 
                           href={watchLink} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-4 bg-secondary p-3 rounded-lg hover:bg-secondary/80 transition-colors"
                         >
                            {p.provider_name === 'Netflix' ? <NetflixLogo className="h-10 w-10 shrink-0" />
                            : <Image src={getImageUrl(p.logo_path, 'w92')} alt={p.provider_name} width={40} height={40} className="rounded-md shrink-0" />}
                            <span className="flex-grow font-semibold">{p.provider_name} <span className="text-muted-foreground font-normal text-sm">({p.country})</span></span>
                             <div className="flex gap-1 shrink-0">
                              {p.types.map(type => (
                                <Badge key={type} variant={type === 'Stream' ? 'default' : 'secondary'}>{type}</Badge>
                              ))}
                             </div>
                         </a>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Streaming information is not available for this title.</p>
            )}
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
