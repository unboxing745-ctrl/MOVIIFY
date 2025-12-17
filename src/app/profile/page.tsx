
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { MovieResult } from '@/lib/types';
import { fetchTMDb } from '@/lib/tmdb';
import MovieCard from '@/components/movies/MovieCard';
import { Heart, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [likedMovies, setLikedMovies] = useState<MovieResult[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (!userDocRef) return;
      setLoadingMovies(true);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const likedMovieIds: string[] = userData.likedMovieIds || [];

          const moviePromises = likedMovieIds.map(id =>
            fetchTMDb<MovieResult>(`movie/${id}`)
          );
          const movies = await Promise.all(moviePromises);
          setLikedMovies(movies.filter(m => m.id)); // Filter out any that failed
        }
      } catch (error) {
        console.error("Failed to fetch liked movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };

    if (user) {
      fetchLikedMovies();
    }
  }, [userDocRef, user]);


  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 pt-28 space-y-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const joinDate = user.metadata.creationTime ? new Date(user.metadata.creationTime) : null;

  return (
    <div className="container mx-auto px-4 py-8 pt-28 space-y-12">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
            <div className="bg-secondary h-32" />
            <div className="flex items-end gap-4 p-6 -mt-16">
                 <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback className="text-4xl">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className='pb-2'>
                    <h1 className="text-3xl font-bold font-headline">{user.displayName || 'Anonymous User'}</h1>
                     <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {user.email && (
                            <div className='flex items-center gap-2'>
                                <Mail className='w-4 h-4' />
                                <span>{user.email}</span>
                            </div>
                        )}
                        {joinDate && (
                            <div className='flex items-center gap-2'>
                                <CalendarIcon className='w-4 h-4' />
                                <span>Joined {format(joinDate, 'MMMM yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3">
            <Heart className="text-primary w-8 h-8" />
            Liked Movies
        </h2>
        {loadingMovies ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : likedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {likedMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
        ) : (
            <div className="text-center py-16 bg-secondary/50 rounded-lg">
                <p className="text-lg text-muted-foreground">You haven&apos;t liked any movies yet.</p>
                <Button asChild variant="link" className='mt-2'>
                    <Link href="/">Discover movies</Link>
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
