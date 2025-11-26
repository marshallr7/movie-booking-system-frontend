import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Film, LogOut, Clock, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Movie {
  movieId: number;
  title: string;
  genre: string;
  durationMin: number;
  rating: string;
  coverImageUrl: string;
  description?: string;
}

interface MovieSelectionScreenProps {
  onSelectMovie: (movie: Movie) => void;
  onLogout: () => void;
}

export function MovieSelectionScreen({ onSelectMovie, onLogout }: MovieSelectionScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5086/api/movies');
        if (!response.ok) throw new Error('Failed to load movies');

        const data = await response.json();

        setMovies(
          data.map((m: any) => ({
            movieId: m.movieId,
            title: m.title,
            genre: m.genre,
            durationMin: m.durationMin,
            rating: m.rating,
            coverImageUrl: m.coverImageUrl,
            description: m.description,
          }))
        );
      } catch (err) {
        setError('Unable to reach backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-2xl">Movie Booking System</h1>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for movies by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 py-12">Loading movies...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          <div>
            <h2 className="text-white text-2xl mb-6">Now Showing</h2>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No movies found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((movie) => (
                  <Card
                    key={movie.movieId}
                    className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                  >
                    <div className="relative h-96">
                      <ImageWithFallback
                        src={movie.coverImageUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-purple-600 hover:bg-purple-700">
                          {movie.genre}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-white text-xl mb-3">{movie.title}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{movie.durationMin} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => onSelectMovie(movie)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Select Showtime
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
