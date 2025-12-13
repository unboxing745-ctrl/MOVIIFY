import Link from 'next/link';
import Image from 'next/image';
import type { MovieResult } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: MovieResult;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : 'https://picsum.photos/seed/placeholder/500/750';
  
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-sm group-hover:bg-card group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <div className="aspect-[2/3] relative">
          <Image
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            data-ai-hint="movie poster"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardContent className="p-3 flex-grow flex flex-col justify-end">
          <h3 className="font-semibold text-sm leading-tight truncate text-white">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground">{new Date(movie.release_date).getFullYear()}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
