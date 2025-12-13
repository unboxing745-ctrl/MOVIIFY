import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock, Film, Users, Video } from 'lucide-react';
import SentimentSummary from '@/components/movies/SentimentSummary';
import ReviewForm from '@/components/movies/ReviewForm';
import { fetchTMDb, getImageUrl } from '@/lib/tmdb';
import type { MovieDetails, Review } from '@/lib/types';

// Mock reviews for now
const getReviewsByMovieId = (movieId: string): Review[] => {
    return [
        {
            id: '1',
            movieId: movieId,
            userId: '1',
            userName: 'CinemaFan',
            userAvatar: '/avatars/01.png',
            rating: 4,
            comment: "A masterpiece of modern cinema. The acting was superb and the story was captivating.",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        },
        {
            id: '2',
            movieId: movieId,
            userId: '2',
            userName: 'MovieMaven',
            userAvatar: '/avatars/02.png',
            rating: 5,
            comment: "Absolutely stunning visuals and a soundtrack that will stick with you for days. Highly recommended!",
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        }
    ]
}


export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await fetchTMDb<MovieDetails>(`movie/${params.id}`);

  if (!movie || !movie.id) {
    notFound();
  }

  const reviews = getReviewsByMovieId(params.id);
  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : 'https://picsum.photos/seed/placeholder/500/750';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl">
            <Image
              src={posterUrl}
              alt={`Poster for ${movie.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              data-ai-hint="movie poster"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{movie.vote_average.toFixed(1)} / 10</span>
              </div>
            </div>
          </div>

          <p className="text-lg text-foreground/80">{movie.overview}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="flex items-start gap-3">
              <Video className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Status</h3>
                <p className="text-muted-foreground">{movie.status}</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Popularity</h3>
                <p className="text-muted-foreground">{movie.popularity.toFixed(0)}</p>
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
            <ReviewForm movieId={String(movie.id)} />
        </section>
      </div>
    </div>
  );
}
