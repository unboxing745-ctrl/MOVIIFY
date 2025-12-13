import { getMovieById, getReviewsByMovieId } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Rating from '@/components/movies/Rating';
import { Clock, Film, Users, Video } from 'lucide-react';
import ReviewCard from '@/components/movies/ReviewCard';
import SentimentSummary from '@/components/movies/SentimentSummary';
import ReviewForm from '@/components/movies/ReviewForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  const reviews = getReviewsByMovieId(params.id);
  const placeholder = PlaceHolderImages.find((p) => p.id === movie.posterId);
  const imageUrl = placeholder?.imageUrl ?? 'https://picsum.photos/seed/placeholder/500/750';
  const imageHint = placeholder?.imageHint ?? 'movie poster';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl">
            <Image
              src={imageUrl}
              alt={`Poster for ${movie.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              data-ai-hint={imageHint}
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Rating rating={movie.rating} />
                <span className="font-semibold">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <p className="text-lg text-foreground/80">{movie.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Director</h3>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Starring</h3>
                <p className="text-muted-foreground">{movie.actors.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-3xl font-bold font-headline mb-6">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
                <SentimentSummary reviews={reviews} />
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
          )}
        </section>

        <section>
            <ReviewForm movieId={movie.id} />
        </section>
      </div>
    </div>
  );
}
