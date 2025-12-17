
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (!tmdbApiKey || tmdbApiKey === "YOUR_TMDB_API_KEY_HERE") {
    // This will now be the active path since the key was removed or is a placeholder.
    return NextResponse.json(
      { error: 'TMDB API key is not configured. Please add it to your .env.local file.' },
      { status: 500 }
    );
  }

  if (!path) {
    return NextResponse.json({ error: 'TMDB API path is required.' }, { status: 400 });
  }

  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  
  // Forward search params from the original request to the TMDB API
  searchParams.forEach((value, key) => {
    if (key !== 'path') {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${tmdbApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error:', errorData);
      throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching data from TMDB proxy:', error);
    if (path.includes('search') || path.includes('discover')) {
        return NextResponse.json({ results: [], page: 1, total_pages: 1, total_results: 0 });
    }
    return NextResponse.json({ results: [] });
  }
}
