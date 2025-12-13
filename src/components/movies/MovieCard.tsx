
import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: MovieResult & { media_type?: 'movie' | 'tv' };
}

export default function MovieCard({ movie }: MovieCardProps) {
    const title = movie.title || (movie as any).name;
    const releaseDate = movie.release_date || (movie as any).first_air_date;
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    const detailUrl = `/movies/${movie.id}?type=${mediaType}`;

    if (!movie.poster_path) {
        return (
            <Link href={detailUrl} className="group block space-y-2">
                <div className="aspect-[2/3] w-full rounded-lg bg-muted flex items-center justify-center">
                    <span className='text-xs text-muted-foreground'>No Image</span>
                </div>
                 <div className="pt-2">
                    <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{releaseYear}</p>
                </div>
            </Link>
        )
    }

  return (
    <Link href={detailUrl} className="group block space-y-2">
        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden">
            <Image
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={`Poster for ${title}`}
                width={500}
                height={750}
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="movie poster image"
            />
        </div>
        <div className="pt-2">
            <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground">{releaseYear}</p>
        </div>
    </Link>
  );
}
