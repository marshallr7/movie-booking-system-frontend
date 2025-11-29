import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export function MovieSelectionScreen() {
  const navigate = useNavigate();
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
        setMovies(data);
      } catch {
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

      {/* HEADER */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-2xl">Movie Booking System</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/login")} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* LOADING */}
        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {/* ERROR */}
        {!loading && error && <p className="text-center text-red-500">{error}</p>}

        {/* MOVIE GRID */}
        {!loading && !error && (
          <div>
            <h2 className="text-white text-2xl mb-6">Now Showing</h2>

            {filteredMovies.length === 0 ? (
              <p className="text-center text-gray-400">No movies found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((movie) => (
                  <Card key={movie.movieId} className="bg-gray-800 border-gray-700 hover:shadow-lg">
                    <div className="h-96 relative">
                      <ImageWithFallback
                        src={movie.coverImageUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-white text-xl mb-3">{movie.title}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {movie.durationMin} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {movie.rating}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate(`/seats/${movie.movieId}`)}
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

export default MovieSelectionScreen;
