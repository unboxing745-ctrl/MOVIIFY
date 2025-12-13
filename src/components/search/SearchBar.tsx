'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
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
        <form onSubmit={handleSearch} className="w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    name="q"
                    placeholder="Search movies by genre, title, or year..."
                    className="pl-10 h-12 w-full bg-background/80"
                    defaultValue={defaultQuery}
                    aria-label="Search movies"
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-6"
                >
                  <Search className="h-4 w-4 mr-2 md:hidden" />
                  <span className="hidden md:block">Search</span>
                </Button>
            </div>
        </form>
    )
}
