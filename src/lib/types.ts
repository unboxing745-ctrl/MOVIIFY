// Local types (if you were to have them)
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  description: string;
  posterId: string;
  genres: string[];
  director: string;
  actors: string[];
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// TMDB API Types
export interface MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: { id: number; logo_path: string; name: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name:string }[];
  status: string;
  tagline: string;
  title: string;
tribal-pay-documents-acme-corp
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: { results: VideoResult[] };
  'watch/providers': { results: WatchProviders };
}

export interface VideoResult {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface WatchProviderDetails {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviders {
  [countryCode: string]: {
    link: string;
    flatrate?: WatchProviderDetails[];
    rent?: WatchProviderDetails[];
    buy?: WatchProviderDetails[];
    free?: WatchProviderDetails[];
  };
}
