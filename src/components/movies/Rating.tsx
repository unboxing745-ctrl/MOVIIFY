import { Star, StarHalf, StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  starClassName?: string;
}

const Rating = ({
  rating,
  maxRating = 5,
  className,
  starClassName,
}: RatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn('h-4 w-4 text-amber-400 fill-amber-400', starClassName)}
        />
      ))}
      {halfStar && (
        <StarHalf
          key="half"
          className={cn('h-4 w-4 text-amber-400 fill-amber-400', starClassName)}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn('h-4 w-4 text-amber-400', starClassName)}
        />
      ))}
    </div>
  );
};

export default Rating;
