
import { NextRequest, NextResponse } from 'next/server';
import { fetchTMDb } from '@/lib/tmdb';
import type { WatchProviders } from '@/lib/types';

// This function would ideally be more robust, potentially using a geo-IP service
// or accepting a region from the client request headers.
function getRegionFromRequest(request: NextRequest): string {
  // For Vercel, check the 'x-vercel-ip-country' header.
  const country = request.headers.get('x-vercel-ip-country');
  if (country) {
    return country;
  }
  // Fallback for local development or other platforms
  return 'US';
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get('tmdbId');
    const type = searchParams.get('type');
    const userRegionOverride = searchParams.get('region');

    if (!tmdbId || !type || (type !== 'movie' && type !== 'tv')) {
        return NextResponse.json({ error: 'Missing or invalid tmdbId or type' }, { status: 400 });
    }

    try {
        // Fetch directly from TMDB
        const data = await fetchTMDb<{ results: WatchProviders }>(`${type}/${tmdbId}/watch/providers`);
        
        if (!data || !data.results) {
            throw new Error('Invalid data from TMDB API');
        }

        // Region fallback logic
        const userRegion = userRegionOverride || getRegionFromRequest(request);
        const preferredRegions = [userRegion, 'IN', 'TR', 'US', 'GB'];
        let finalProviders: WatchProviders['results'] | null = null;

        for (const region of preferredRegions) {
            if (data.results[region]) {
                finalProviders = { [region]: data.results[region] };
                break;
            }
        }
        
        const providersToReturn = finalProviders || {};
        
        return NextResponse.json(providersToReturn);

    } catch (error) {
        console.error('Error in getWatchProviders:', error);
        return NextResponse.json({ error: 'Failed to fetch watch providers.' }, { status: 500 });
    }
}
