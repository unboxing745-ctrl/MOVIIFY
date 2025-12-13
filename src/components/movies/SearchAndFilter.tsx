
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

function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultQuery = searchParams.get('q') || '';
  
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = formData.get('q') as string;
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (query) {
        current.set('q', query);
      } else {
        current.delete('q');
      }

      const searchPath = current.toString() ? `?${current.toString()}` : '/search';
      router.push(`/search${searchPath.startsWith('?') ? '' : '?'}${current.toString()}`);
    };
  
    return (
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <Input
          type="search"
          name="q"
          placeholder="Search for a movie..."
          className="text-base h-12"
          defaultValue={defaultQuery}
          aria-label="Search movies"
        />
      </form>
    );
  }

function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [genres, setGenres] = useState<Genre[]>([]);
  
    useEffect(() => {
      fetchTMDb<{ genres: Genre[] }>('genre/movie/list').then((data) => {
        setGenres(data.genres);
      });
    }, []);

    const handleFilterChange = (type: 'genre', value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        const key = type === 'genre' ? 'with_genres' : '';

        if (value && value !== 'all') {
            current.set(key, value);
        } else {
            current.delete(key);
        }
        
        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`/search${query}`);
    }
  
    return (
      <div className="flex gap-2">
        <Select onValueChange={(value) => handleFilterChange('genre', value)} defaultValue={searchParams.get('with_genres') || 'all'}>
          <SelectTrigger className="w-[220px] h-12 text-base">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={String(genre.id)}>{genre.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="lg" className="h-12" form='search-form'>
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    );
  }

export default function SearchAndFilter() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
        <Suspense>
            <SearchBar />
            <Filters />
        </Suspense>
    </div>
  );
}
