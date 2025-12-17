
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageUrl } from '@/lib/tmdb';
import type { WatchProviders } from '@/lib/types';
import { NetflixLogo } from '../icons/NetflixLogo';

interface WhereToWatchProps {
  tmdbId: number;
  type: 'movie' | 'tv';
}

interface ProviderDisplayData {
    region: string;
    link: string;
    flatrate: WatchProviders['US']['flatrate'];
    rent: WatchProviders['US']['rent'];
    buy: WatchProviders['US']['buy'];
}

export default function WhereToWatch({ tmdbId, type }: WhereToWatchProps) {
  const [providers, setProviders] = useState<ProviderDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      if (!tmdbId || !type) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/watch-providers?tmdbId=${tmdbId}&type=${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        const region = Object.keys(data)[0];
        if (region) {
            setProviders({
                region,
                link: data[region].link,
                flatrate: data[region].flatrate,
                rent: data[region].rent,
                buy: data[region].buy
            });
        } else {
             setProviders(null); // No providers found
        }
      } catch (err) {
        setError('Could not load provider information.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, [tmdbId, type]);

  const renderProviderList = (providerList: WatchProviders['US']['flatrate'], title: string) => {
    if (!providerList || providerList.length === 0) return null;
    
    // Filter out Netflix and sort by display priority
    const sortedProviders = providerList
        .filter(p => p.provider_name.toLowerCase() !== 'netflix')
        .sort((a,b) => a.display_priority - b.display_priority);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="flex flex-wrap gap-3">
            {sortedProviders.map((provider) => (
                <a 
                    key={provider.provider_id} 
                    href={providers?.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={provider.provider_name}
                    className="w-12 h-12 relative rounded-lg overflow-hidden border border-border transition-transform hover:scale-105"
                >
                    <Image
                        src={getImageUrl(provider.logo_path, 'w92')}
                        alt={provider.provider_name}
                        fill
                        className="object-cover"
                        sizes='48px'
                    />
                </a>
            ))}
            </div>
        </div>
    );
  }

  const hasNetflix = providers?.flatrate?.some(p => p.provider_name.toLowerCase() === 'netflix');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
             <Skeleton className="h-12 w-12 rounded-lg" />
             <Skeleton className="h-12 w-12 rounded-lg" />
             <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return (
        <Card className="bg-secondary/30 border-dashed">
            <CardHeader>
                <CardTitle>Where to Watch</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Provider information not available for this title.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where to Watch ({providers.region})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasNetflix && (
            <a href={`https://www.netflix.com/search?q=${tmdbId}`} target="_blank" rel="noopener noreferrer" className='block hover:scale-105 transition-transform'>
                <NetflixLogo className="w-32" />
            </a>
        )}
        {renderProviderList(providers.flatrate, 'Stream')}
        {renderProviderList(providers.rent, 'Rent')}
        {renderProviderList(providers.buy, 'Buy')}
      </CardContent>
    </Card>
  );
}
