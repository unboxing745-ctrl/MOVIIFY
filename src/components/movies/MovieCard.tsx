import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Rating from './Rating';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === movie.posterId);
  const imageUrl = placeholder?.imageUrl ?? 'https://picsum.photos/seed/placeholder/500/750';
  const imageHint = placeholder?.imageHint ?? 'movie poster';

  return (
    <Link href={`/movies/${movie.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:border-primary">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl}
            alt={`Poster for ${movie.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={imageHint}
          />
        </div>
        <CardContent className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-primary">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground">{movie.year}</p>
          </div>
          <div className="mt-2">
            <Rating rating={movie.rating} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
