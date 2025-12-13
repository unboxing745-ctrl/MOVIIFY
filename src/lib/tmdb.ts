
import { MovieResult } from './types';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side: Construct a full URL using the window's origin.
    return `${window.location.origin}/api/tmdb`;
  }
  // Server-side: Use environment variables to construct the full URL.
  const host = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:9002';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/api/tmdb`;
}

export async function fetchTMDb<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = new URL(baseUrl);
  url.searchParams.append('path', path);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate cache every hour
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error:', errorData);
      throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching data from TMDB proxy:', error);
    // In case of a network or other fetch error, we return a default/empty structure
    // to prevent the app from crashing. Adjust this as needed.
    if (path.includes('search') || path.includes('discover')) {
        return { results: [], page: 1, total_pages: 1, total_results: 0 } as T;
    }
    return { results: [] } as T;
  }
}

export function getImageUrl(path: string, size: string = 'w500'): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
