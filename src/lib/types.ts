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
