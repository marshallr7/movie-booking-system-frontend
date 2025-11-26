import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Film, LogOut, Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminPanelProps {
  onLogout: () => void;
}

interface MovieListing {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  releaseDate: string;
}

interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  date: string;
  time: string;
  availableSeats: number;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [movies, setMovies] = useState<MovieListing[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [isAddShowtimeOpen, setIsAddShowtimeOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
    releaseDate: '',
  });
  const [newShowtime, setNewShowtime] = useState({
    movieId: 0,
    date: '',
    time: '',
  });

  //  FETCH MOVIES FROM BACKEND
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5086/api/movies");
        if (!response.ok) throw new Error("Failed to load movies");

        const data = await response.json();

        setMovies(
          data.map((m: any) => ({
            id: m.movieId,
            title: m.title,
            genre: m.genre,
            duration: `${m.durationMin} min`,
            rating: m.rating,
            releaseDate: m.releaseDate?.split("T")[0],
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load movies from backend");
      }
    };

    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    toast.error("Adding movies is not connected to backend yet.");
  };

  const handleDeleteMovie = (id: number) => {
    setMovies(movies.filter((m) => m.id !== id));
    setShowtimes(showtimes.filter((s) => s.movieId !== id));
    toast.success("Movie removed from list (local only)");
  };

  const handleAddShowtime = () => {
    if (!newShowtime.movieId || !newShowtime.date || !newShowtime.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const movie = movies.find((m) => m.id === newShowtime.movieId);
    if (!movie) {
      toast.error('Invalid movie selected');
      return;
    }

    const showtime: Showtime = {
      id: Math.max(...showtimes.map((s) => s.id), 0) + 1,
      movieId: newShowtime.movieId,
      movieTitle: movie.title,
      date: newShowtime.date,
      time: newShowtime.time,
      availableSeats: 80,
    };

    setShowtimes([...showtimes, showtime]);
    setNewShowtime({ movieId: 0, date: '', time: '' });
    setIsAddShowtimeOpen(false);
    toast.success('Showtime added (local only)');
  };

  const handleDeleteShowtime = (id: number) => {
    setShowtimes(showtimes.filter((s) => s.id !== id));
    toast.success("Showtime removed (local only)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl">Movie Booking System Admin</h1>
                <p className="text-gray-400 text-sm">Theater Management System</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="movies">Movie Listings</TabsTrigger>
            <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
          </TabsList>

          {/* MOVIES TAB */}
          <TabsContent value="movies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl">Manage Movies</h2>
              <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus className="w-4 h-4" />
                Add Movie (disabled)
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Genre</TableHead>
                      <TableHead className="text-gray-300">Duration</TableHead>
                      <TableHead className="text-gray-300">Rating</TableHead>
                      <TableHead className="text-gray-300">Release Date</TableHead>
                      <TableHead className="text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="text-white">{movie.title}</TableCell>
                        <TableCell>
                          <Badge className="bg-purple-600">{movie.genre}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{movie.duration}</TableCell>
                        <TableCell className="text-gray-300">{movie.rating}</TableCell>
                        <TableCell className="text-gray-300">{movie.releaseDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteMovie(movie.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SHOWTIMES TAB */}
          <TabsContent value="showtimes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl">Manage Showtimes</h2>
              <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus className="w-4 h-4" />
                Add Showtime (local)
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                      <TableHead className="text-gray-300">Movie</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Time</TableHead>
                      <TableHead className="text-gray-300">Available Seats</TableHead>
                      <TableHead className="text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showtimes.map((showtime) => (
                      <TableRow key={showtime.id} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="text-white">{showtime.movieTitle}</TableCell>
                        <TableCell className="text-gray-300">{showtime.date}</TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {showtime.time}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {showtime.availableSeats}/80
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteShowtime(showtime.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
