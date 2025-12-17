
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (!tmdbApiKey || tmdbApiKey === 'YOUR_TMDB_API_KEY_HERE') {
    return NextResponse.json(
      { error: 'TMDB API key is not configured. Please add your key to the .env.local file.' },
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
      return NextResponse.json(
        { error: 'Failed to fetch data from TMDB', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
