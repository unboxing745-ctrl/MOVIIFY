import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';
import { Badge } from '../ui/badge';
import { LanguagesIcon, Youtube } from 'lucide-react';
import { NetflixLogo } from '../icons/NetflixLogo';

interface MovieCardProps {
  movie: MovieResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path, 'w500')
    : `https://picsum.photos/seed/${movie.id}/500/750`;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  
  // Mock data based on image
  const isFree = movie.id % 3 === 0;
  const onNetflix = movie.id % 2 === 0;
  const languageCount = movie.genre_ids.length + 5;


  return (
    <Link href={`/movies/${movie.id}`} className="group block space-y-3">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
            <Image
                src={getImageUrl(movie.backdrop_path, 'w500')}
                alt={`Poster for ${movie.title}`}
                width={500}
                height={281}
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                data-ai-hint="movie poster image"
            />
        </div>
        <div className='space-y-2'>
            <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary">
                {movie.title}
            </h3>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
                <div className='flex items-center gap-3'>
                    <span>{releaseYear}</span>
                    <div className='flex items-center gap-1'>
                        <LanguagesIcon className='w-4 h-4 text-sky-400' />
                        <span>{languageCount} Languages</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    {onNetflix ? <NetflixLogo className="w-4 h-4" /> : <Youtube className="w-4 h-4 text-red-600" />}
                    <Badge variant={isFree ? 'default' : 'secondary'} className={isFree ? 'bg-green-600/20 text-green-400 border-green-500/30' : ''}>
                        {isFree ? 'Free' : 'Paid'}
                    </Badge>
                </div>
            </div>
        </div>
    </Link>
  );
}
