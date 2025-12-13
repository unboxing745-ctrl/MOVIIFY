
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import UserAuth from './UserAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MoviifyLogo } from '../icons/MoviifyLogo';
import { Input } from '../ui/input';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';
  const { user } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300',
        isHomePage && !isScrolled
          ? 'bg-transparent'
          : 'bg-background/90 backdrop-blur-sm border-b border-border'
      )}
    >
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <MoviifyLogo className="w-48 h-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-primary text-foreground/80"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="transition-colors hover:text-primary text-foreground/80 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Button
                  variant="ghost"
                  className="px-0 py-2 h-auto text-sm font-medium"
                >
                  Genres
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=28')}
                >
                  Action
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=12')}
                >
                  Adventure
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=35')}
                >
                  Comedy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=99')}
                >
                  Documentary
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=18')}
                >
                  Drama
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=10751')}
                >
                  Family
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=36')}
                >
                  Historical
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=27')}
                >
                  Horror
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=10749')}
                >
                  Romance
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=878')}
                >
                  Sci-Fi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=53')}
                >
                  Thriller
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/search?with_genres=10752')}
                >
                  War
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/search?sort_by=vote_average.desc"
              className="transition-colors hover:text-primary text-foreground/80"
            >
              Top Rated
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <form
            onSubmit={handleSearch}
            className="hidden md:block w-full max-w-sm"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Search..."
                className="pl-10 h-10 w-full bg-background/80"
                defaultValue={defaultQuery}
                aria-label="Search movies"
              />
            </div>
          </form>
          {user ? (
            <UserAuth />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-primary/80 hover:bg-primary text-primary-foreground"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
