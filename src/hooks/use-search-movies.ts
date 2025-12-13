
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchTMDb } from '@/lib/tmdb';
import type { MovieResult } from '@/lib/types';

interface SearchState {
  movies: MovieResult[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export function useSearchMovies(query: string, genre: string, sortBy: string) {
  const [state, setState] = useState<SearchState>({
    movies: [],
    loading: true,
    error: null,
    page: 1,
    hasMore: true,
  });

  const loadMovies = useCallback(async (page: number, currentMovies: MovieResult[] = []) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      let results: MovieResult[] = [];
      let total_pages = 0;

      if (query) {
        // Fetch both movies and TV shows
        const [movieData, tvData] = await Promise.all([
            fetchTMDb<{ results: MovieResult[]; total_pages: number }>('search/movie', { query, page: String(page) }),
            fetchTMDb<{ results: MovieResult[]; total_pages: number }>('search/tv', { query, page: String(page) })
        ]);
        
        const combinedResults = [
            ...movieData.results.map(r => ({...r, media_type: 'movie'})), 
            ...tvData.results.map(r => ({...r, media_type: 'tv'}))
        ];

        // Sort by popularity
        combinedResults.sort((a, b) => b.popularity - a.popularity);
        results = combinedResults;
        total_pages = Math.max(movieData.total_pages, tvData.total_pages);
      } else {
        // Discover movies by genre or sort order
        const params: Record<string, string> = { page: String(page) };
         if (genre && genre !== 'all') {
            params.with_genres = genre;
        }
        if (sortBy) {
            params.sort_by = sortBy;
        }
        const data = await fetchTMDb<{ results: MovieResult[]; total_pages: number }>('discover/movie', params);
        results = data.results.map(r => ({...r, media_type: 'movie'}));
        total_pages = data.total_pages;
      }
      
      const newMovies = results.filter(
        (newMovie) => !currentMovies.some((existingMovie) => existingMovie.id === newMovie.id)
      );

      setState(prevState => ({
        ...prevState,
        movies: page === 1 ? results : [...prevState.movies, ...newMovies],
        loading: false,
        page,
        hasMore: page < total_pages && page < 500, // TMDB limit
      }));
    } catch (err) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to fetch movies.',
      }));
    }
  }, [query, genre, sortBy]);

  useEffect(() => {
    // Reset and fetch movies when query, genre or sortBy changes
    setState({
        movies: [],
        loading: true,
        error: null,
        page: 1,
        hasMore: true,
    });
    loadMovies(1);
  }, [query, genre, sortBy, loadMovies]);

  const loadMore = () => {
    if (state.hasMore && !state.loading) {
      const nextPage = state.page + 1;
      loadMovies(nextPage, state.movies);
    }
  };

  return { ...state, loadMore };
}
