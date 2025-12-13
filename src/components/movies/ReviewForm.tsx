'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth, useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: 'Please select a rating.' })
    .max(5),
  comment: z
    .string()
    .min(10, { message: 'Comment must be at least 10 characters.' })
    .max(1000, { message: 'Comment must not exceed 1000 characters.' }),
});

export default function ReviewForm({ movieId }: { movieId: string }) {
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (!firestore || !user) return;

    const reviewsCol = collection(firestore, `movies/${movieId}/reviews`);
    addDocumentNonBlocking(reviewsCol, {
      ...values,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userAvatar: user.photoURL || '',
      movieId: movieId,
      createdAt: serverTimestamp(),
      reviewDate: new Date().toISOString(),
    });

    toast({
      title: 'Review Submitted!',
      description: "Thanks for sharing your thoughts.",
    });
    form.reset();
  }

  if (!user) {
    return (
        <Card className="bg-secondary/50 border-dashed">
            <CardHeader>
                <CardTitle>Join the Conversation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground'>You must be logged in to write a review.</p>
                    <Button asChild>
                        <Link href="/login">Log In</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card>
        <CardHeader>
            <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Rating</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                            key={star}
                            className={cn(
                                'h-8 w-8 cursor-pointer transition-colors',
                                (hoverRating || field.value) >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            )}
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="What did you think of the movie?"
                        rows={5}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
