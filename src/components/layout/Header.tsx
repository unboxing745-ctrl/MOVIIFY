
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
import { useRouter } from 'next/navigation';
import SearchBar from '../search/SearchBar';
import { useUser } from '@/firebase';

export default function Header() {
    const router = useRouter();
    const { user } = useUser();
  
  return (
    <header className="absolute top-0 z-50 w-full bg-transparent">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Clapperboard className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">MOVIIFY</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary text-foreground/80">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-0 py-2 h-auto text-sm font-medium transition-colors hover:text-primary text-foreground/80 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">Genres</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=28')}>Action</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=35')}>Comedy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=18')}>Drama</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=27')}>Horror</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/search?with_genres=878')}>Sci-Fi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/search?sort_by=vote_average.desc" className="transition-colors hover:text-primary text-foreground/80">
              Top Rated
            </Link>
            <Link href="/search?with_genres=10751" className="transition-colors hover:text-primary text-foreground/80">
              Family
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className='hidden md:block'>
              <SearchBar />
            </div>
            {user ? (
              <UserAuth />
            ) : (
               <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className='bg-red-600 hover:bg-red-700 text-white'>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}
