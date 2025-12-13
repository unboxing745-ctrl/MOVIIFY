
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

export function useSearchMovies(query: string, genre: string) {
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
      const path = query ? 'search/movie' : 'discover/movie';
      const params: Record<string, string> = { page: String(page) };
      if (query) {
        params.query = query;
      }
      if (genre && genre !== 'all') {
        params.with_genres = genre;
      }

      const data = await fetchTMDb<{ results: MovieResult[]; total_pages: number }>(path, params);
      
      const newMovies = data.results.filter(
        (newMovie) => !currentMovies.some((existingMovie) => existingMovie.id === newMovie.id)
      );

      setState(prevState => ({
        ...prevState,
        movies: page === 1 ? data.results : [...prevState.movies, ...newMovies],
        loading: false,
        page,
        hasMore: page < data.total_pages,
      }));
    } catch (err) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: 'Failed to fetch movies.',
      }));
    }
  }, [query, genre]);

  useEffect(() => {
    // Reset and fetch movies when query or genre changes
    setState({
        movies: [],
        loading: true,
        error: null,
        page: 1,
        hasMore: true,
    });
    loadMovies(1);
  }, [query, genre, loadMovies]);

  const loadMore = () => {
    if (state.hasMore && !state.loading) {
      const nextPage = state.page + 1;
      loadMovies(nextPage, state.movies);
    }
  };

  return { ...state, loadMore };
}
