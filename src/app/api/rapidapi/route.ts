
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    return NextResponse.json(
      { error: 'RapidAPI key is not configured. Please add it to your .env.local file.' },
      { status: 500 }
    );
  }

  if (!path) {
    return NextResponse.json({ error: 'RapidAPI path is required.' }, { status: 400 });
  }

  const url = new URL(`https://imdb236.p.rapidapi.com/${path}`);

  // Forward search params from the original request to the RapidAPI
  searchParams.forEach((value, key) => {
    if (key !== 'path') {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-host': 'imdb236.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('RapidAPI Error:', errorData);
      throw new Error(`Failed to fetch from RapidAPI: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching data from RapidAPI proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch data from RapidAPI.' }, { status: 500 });
  }
}
