
import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: MovieResult & { media_type?: 'movie' | 'tv' };
}

export default function MovieCard({ movie }: MovieCardProps) {
    const title = movie.title || (movie as any).name;
    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    const detailUrl = `/movies/${movie.id}?type=${mediaType}`;

    if (!movie.backdrop_path) {
        return (
            <Link href={detailUrl} className="group block space-y-2">
                <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                    <span className='text-xs text-muted-foreground'>No Image</span>
                </div>
                 <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
                    {title}
                </h3>
            </Link>
        )
    }

  return (
    <Link href={detailUrl} className="group block space-y-2">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
            <Image
                src={getImageUrl(movie.backdrop_path, 'w500')}
                alt={`Poster for ${title}`}
                width={500}
                height={281}
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                data-ai-hint="movie poster image"
            />
        </div>
        <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
            {title}
        </h3>
    </Link>
  );
}
