import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: MovieResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : 'https://picsum.photos/seed/placeholder/500/750';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  
  return (
    <Link href={`/movies/${movie.id}`} className="group block relative aspect-[2/3]">
      <div className="relative w-full h-full rounded-lg overflow-hidden transition-transform duration-300 ease-in-out transform group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/30">
          <Image
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            data-ai-hint="movie poster"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-bold text-base leading-tight truncate">
              {movie.title}
            </h3>
            {releaseYear && <p className="text-sm text-neutral-300">{releaseYear}</p>}
          </div>
      </div>
    </Link>
  );
}
