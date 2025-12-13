import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Rating from './Rating';
import type { Review } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback>
            {review.userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{review.userName}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rating rating={review.rating} />
            <span>·</span>
            <time dateTime={review.createdAt}>
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
