'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Review } from '@/lib/types';
import { collection } from 'firebase/firestore';
import SentimentSummary from './SentimentSummary';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { Skeleton } from '../ui/skeleton';

export default function MovieReviews({ movieId }: { movieId: string }) {
  const firestore = useFirestore();

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'movies', movieId, 'reviews');
  }, [firestore, movieId]);

  const {
    data: reviews,
    isLoading,
    error,
  } = useCollection<Review>(reviewsQuery);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold font-headline mb-6">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-8">
            <SentimentSummary reviews={reviews} />
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        ) : (
          !isLoading && <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
        )}
      </section>

      <section>
        <ReviewForm movieId={movieId} />
      </section>
    </div>
  );
}
