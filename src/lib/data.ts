import type { Movie, Review } from './types';

const movies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 4.8,
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterId: 'movie-1',
    genres: ['Drama'],
    director: 'Frank Darabont',
    actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
  },
  {
    id: '2',
    title: 'The Godfather',
    year: 1972,
    rating: 4.7,
    description:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterId: 'movie-2',
    genres: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    actors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
  },
  {
    id: '3',
    title: 'The Dark Knight',
    year: 2008,
    rating: 4.9,
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterId: 'movie-3',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    year: 1994,
    rating: 4.6,
    description:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    posterId: 'movie-4',
    genres: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
  },
  {
    id: '5',
    title: 'Forrest Gump',
    year: 1994,
    rating: 4.5,
    description:
      'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    posterId: 'movie-5',
    genres: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
  },
  {
    id: '6',
    title: 'Inception',
    year: 2010,
    rating: 4.8,
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterId: 'movie-6',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Christopher Nolan',
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
  },
  {
    id: '7',
    title: 'The Matrix',
    year: 1999,
    rating: 4.7,
    description:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    posterId: 'movie-7',
    genres: ['Action', 'Sci-Fi'],
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  },
  {
    id: '8',
    title: 'Interstellar',
    year: 2014,
    rating: 4.7,
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterId: 'movie-8',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    director: 'Christopher Nolan',
    actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
  },
  {
    id: '9',
    title: 'Parasite',
    year: 2019,
    rating: 4.8,
    description:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterId: 'movie-9',
    genres: ['Comedy', 'Drama', 'Thriller'],
    director: 'Bong Joon Ho',
    actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
  },
  {
    id: '10',
    title: 'Spirited Away',
    year: 2001,
    rating: 4.6,
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    posterId: 'movie-10',
    genres: ['Animation', 'Adventure', 'Family'],
    director: 'Hayao Miyazaki',
    actors: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
  },
   {
    id: '11',
    title: 'Whiplash',
    year: 2014,
    rating: 4.6,
    description:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    posterId: 'movie-11',
    genres: ['Drama', 'Music'],
    director: 'Damien Chazelle',
    actors: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'],
  },
  {
    id: '12',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    rating: 4.4,
    description:
      'The adventures of Gustave H, a legendary concierge at a famous hotel from the fictional Republic of Zubrowka between the first and second World Wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.',
    posterId: 'movie-12',
    genres: ['Adventure', 'Comedy', 'Drama'],
    director: 'Wes Anderson',
    actors: ['Ralph Fiennes', 'F. Murray Abraham', 'Mathieu Amalric'],
  },
];

const reviews: Review[] = [
  {
    id: 'r1',
    movieId: '1',
    userId: 'u1',
    userName: 'CinemaFan',
    userAvatar: '/avatars/01.png',
    rating: 5,
    comment: 'An absolute masterpiece. The acting and storytelling are top-notch. A must-watch for everyone.',
    createdAt: '2023-10-20T14:48:00.000Z',
  },
  {
    id: 'r2',
    movieId: '1',
    userId: 'u2',
    userName: 'MovieBuff',
    userAvatar: '/avatars/02.png',
    rating: 4.5,
    comment: 'A truly moving and powerful story of hope. Morgan Freeman is incredible.',
    createdAt: '2023-10-21T18:22:00.000Z',
  },
  {
    id: 'r3',
    movieId: '3',
    userId: 'u3',
    userName: 'CriticX',
    userAvatar: '/avatars/03.png',
    rating: 5,
    comment: "Heath Ledger's performance as the Joker is legendary. The best superhero movie ever made.",
    createdAt: '2023-09-05T10:00:00.000Z',
  },
  {
    id: 'r4',
    movieId: '3',
    userId: 'u1',
    userName: 'CinemaFan',
    userAvatar: '/avatars/01.png',
    rating: 4.8,
    comment: "A dark, complex, and unforgettable film. Christopher Nolan's direction is brilliant.",
    createdAt: '2023-09-06T11:30:00.000Z',
  },
  {
    id: 'r5',
    movieId: '6',
    userId: 'u2',
    userName: 'MovieBuff',
    userAvatar: '/avatars/02.png',
    rating: 5,
    comment: 'Mind-bending and visually stunning. A true cinematic experience that will leave you thinking.',
    createdAt: '2023-11-10T20:05:00.000Z',
  },
  {
    id: 'r6',
    movieId: '6',
    userId: 'u4',
    userName: 'FilmGeek',
    userAvatar: '/avatars/04.png',
    rating: 4.5,
    comment: 'Complex plot but so rewarding if you pay attention. The visuals are out of this world.',
    createdAt: '2023-11-11T21:00:00.000Z',
  },
  {
    id: 'r7',
    movieId: '9',
    userId: 'u5',
    userName: 'IndieLover',
    userAvatar: '/avatars/05.png',
    rating: 5,
    comment: "Absolutely brilliant. A rollercoaster of emotions. Bong Joon Ho is a genius.",
    createdAt: '2024-01-15T19:45:00.000Z',
  },
  {
    id: 'r8',
    movieId: '1',
    userId: 'u5',
    userName: 'IndieLover',
    userAvatar: '/avatars/05.png',
    rating: 4.0,
    comment: "It's a classic for a reason. Great story, but a bit slow for my taste.",
    createdAt: '2024-02-15T19:45:00.000Z',
  },
];

export const getMovies = () => movies;

export const getMovieById = (id: string) => movies.find((movie) => movie.id === id);

export const getReviewsByMovieId = (movieId: string) =>
  reviews.filter((review) => review.movieId === movieId);
  
export const getTrendingMovies = () => movies.slice(0, 6);

export const searchMovies = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerCaseQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowerCaseQuery)) ||
    movie.director.toLowerCase().includes(lowerCaseQuery) ||
    movie.actors.some(actor => actor.toLowerCase().includes(lowerCaseQuery))
  );
};
