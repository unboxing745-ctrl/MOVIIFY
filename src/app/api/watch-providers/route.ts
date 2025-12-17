
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app: App;
let db: Firestore;
if (!getApps().length) {
  app = initializeApp();
  db = getFirestore(app);
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const CACHE_DURATION_HOURS = 24;

interface WatchProviderResponse {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: any[];
      rent?: any[];
      buy?: any[];
    };
  };
}

// Function to fetch from TMDB API
async function fetchFromTMDb(path: string): Promise<any> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key is not configured on the server.');
  }
  const url = `https://api.themoviedb.org/3/${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('TMDb API Error:', errorData);
    throw new Error(`Failed to fetch from TMDb: ${response.statusText}`);
  }
  return response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  const type = searchParams.get('type');
  const userRegion = searchParams.get('region')?.toUpperCase();

  // 1. Validate input
  if (!tmdbId || !type || (type !== 'movie' && type !== 'tv')) {
    return NextResponse.json(
      { error: 'Invalid input. "tmdbId" and "type" (movie/tv) are required.' },
      { status: 400 }
    );
  }

  const cacheDocId = `${type}_${tmdbId}`;
  const cacheRef = db.collection('watchProviders').doc(cacheDocId);

  try {
    // Check cache first
    const cachedDoc = await cacheRef.get();
    if (cachedDoc.exists) {
      const data = cachedDoc.data();
      const cachedAt = (data?.cachedAt as Timestamp)?.toDate();
      const now = new Date();
      if (cachedAt && (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60) < CACHE_DURATION_HOURS) {
        return NextResponse.json(data?.providers || {});
      }
    }

    // 2. Fetch watch providers from TMDB
    const data: WatchProviderResponse = await fetchFromTMDb(`${type}/${tmdbId}/watch/providers`);

    // 3. Region Priority Order
    const preferredRegions = [...new Set([userRegion, 'IN', 'TR', 'US', 'GB'].filter(Boolean) as string[])];
    
    let result = {};

    // 4. Apply region fallback logic
    for (const region of preferredRegions) {
      const providers = data.results[region];
      if (providers && (providers.flatrate || providers.rent || providers.buy)) {
        result = providers;
        break; // Found providers, stop searching
      }
    }
    
    // 5. Cache result in Firestore (even if empty)
    await cacheRef.set({
      tmdbId,
      type,
      providers: result,
      cachedAt: Timestamp.now(),
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in getWatchProviders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch providers.', details: error.message },
      { status: 500 }
    );
  }
}

    