import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';
import { Skeleton } from '../ui/skeleton';

interface MovieCardProps {
  movie: MovieResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
    if (!movie.backdrop_path) {
        return (
            <Link href={`/movies/${movie.id}`} className="group block space-y-2">
                <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                    <span className='text-xs text-muted-foreground'>No Image</span>
                </div>
                 <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
                    {movie.title}
                </h3>
            </Link>
        )
    }

  return (
    <Link href={`/movies/${movie.id}`} className="group block space-y-2">
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
        <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
            {movie.title}
        </h3>
    </Link>
  );
}
