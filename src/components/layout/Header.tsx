
'use client';

import Link from 'next/link';
import { Clapperboard, Search } from 'lucide-react';
import UserAuth from './UserAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultQuery = searchParams.get('q') || '';
  
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const query = formData.get('q') as string;
      
      const params = new URLSearchParams();
      
      if (query) {
        params.set('q', query);
      } else {
        return; // Do not search if query is empty
      }

      router.push(`/search?${params.toString()}`);
    };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Clapperboard className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">MOVIIFY</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-0 py-2 h-auto text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">Genres</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=28')}>Action</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=35')}>Comedy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=18')}>Drama</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=27')}>Horror</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=878')}>Sci-Fi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/search?sort_by=vote_average.desc" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Top Rated
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground font-semibold text-primary">
              New Releases
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <form onSubmit={handleSearch} className="flex-1 ml-auto max-w-sm">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        name="q"
                        placeholder="Search movies..."
                        className="pl-9"
                        defaultValue={defaultQuery}
                        aria-label="Search movies"
                    />
                </div>
            </form>
          <UserAuth />
        </div>
      </div>
    </header>
  );
}
