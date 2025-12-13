
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { fetchTMDb } from '@/lib/tmdb';

interface Genre {
  id: number;
  name: string;
}

function SearchAndFilterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultQuery = searchParams.get('q') || '';
    const defaultGenre = searchParams.get('with_genres') || 'all';
    const [genres, setGenres] = useState<Genre[]>([]);
  
    useEffect(() => {
      fetchTMDb<{ genres: Genre[] }>('genre/movie/list').then((data) => {
        setGenres(data.genres);
      });
    }, []);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = formData.get('q') as string;
      const genre = formData.get('with_genres') as string;
      
      const current = new URLSearchParams();
      
      if (query) {
        current.set('q', query);
      }
      if (genre && genre !== 'all') {
        current.set('with_genres', genre);
      }

      const search = current.toString();
      const searchPath = search ? `?${search}` : '/search';

      router.push(`/search${searchPath}`);
    };
  
    return (
        <form onSubmit={handleSearch} id="search-form" className="flex flex-col md:flex-row gap-4">
            <Input
                type="search"
                name="q"
                placeholder="Search for a movie..."
                className="text-base h-12 flex-1"
                defaultValue={defaultQuery}
                aria-label="Search movies"
            />
            <div className="flex gap-2">
                <Select name="with_genres" defaultValue={defaultGenre}>
                    <SelectTrigger className="w-full md:w-[220px] h-12 text-base">
                        <SelectValue placeholder="Genre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {genres.map((genre) => (
                        <SelectItem key={genre.id} value={String(genre.id)}>{genre.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="h-12">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                </Button>
            </div>
      </form>
    );
  }

export default function SearchAndFilter() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
        <SearchAndFilterContent />
    </Suspense>
  );
}
