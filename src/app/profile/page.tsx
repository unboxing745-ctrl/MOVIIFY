
'use client';

import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection, orderBy, query, limit } from 'firebase/firestore';
import type { SearchHistory } from '@/lib/types';
import { Mail, Calendar as CalendarIcon, Edit, History } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

const profileSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters.').max(50, 'Name is too long.'),
    photoURL: z.string().url('Please enter a valid URL.').or(z.literal('')),
});

export default function ProfilePage() {
  const { user, isUserLoading, auth } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);

  const searchHistoryQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
        collection(firestore, 'users', user.uid, 'searchHistory'),
        orderBy('timestamp', 'desc'),
        limit(10)
    );
  }, [firestore, user?.uid]);

  const { data: searchHistory, isLoading: isLoadingHistory } = useCollection<SearchHistory>(searchHistoryQuery);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !auth?.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
        photoURL: values.photoURL,
      });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
      setProfileDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile changes.",
      });
    }
  };

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
            <div className="flex items-end gap-4 p-6 -mt-16 relative">
                 <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName || 'User'} />
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
                <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline" size="icon" className='absolute top-6 right-6'>
                            <Edit className='h-4 w-4' />
                            <span className="sr-only">Edit Profile</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onProfileSubmit)} className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="photoURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Picture URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://example.com/image.png" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
      </Card>
      
      <div>
           <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3">
              <History className="text-primary w-8 h-8" />
              Search History
          </h2>
          {isLoadingHistory ? (
               <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                     <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
          ) : searchHistory && searchHistory.length > 0 ? (
              <Card>
                  <CardContent className="p-0">
                      <ul className='divide-y'>
                          {searchHistory.map(item => (
                              <li key={item.id} className='p-4 flex justify-between items-center hover:bg-secondary/50'>
                                  <Link href={`/search?q=${encodeURIComponent(item.query)}`} className="font-medium hover:underline">
                                      {item.query}
                                  </Link>
                                  <span className='text-sm text-muted-foreground'>
                                      {item.timestamp ? formatDistanceToNow(item.timestamp.toDate(), { addSuffix: true }) : ''}
                                  </span>
                              </li>
                          ))}
                      </ul>
                  </CardContent>
              </Card>
          ) : (
              <div className="text-center py-16 bg-secondary/50 rounded-lg">
                  <p className="text-lg text-muted-foreground">Your search history is empty.</p>
              </div>
          )}
      </div>
    </div>
  );
}
