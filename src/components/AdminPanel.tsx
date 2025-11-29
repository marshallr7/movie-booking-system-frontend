import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Film, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AdminPanel() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editMovieId, setEditMovieId] = useState<number | null>(null);

  const emptyMovieForm = {
    title: "",
    description: "",
    genre: "",
    durationMin: 0,
    rating: "",
    releaseDate: "",
    coverImageUrl: "",
  };

  const [form, setForm] = useState({ ...emptyMovieForm });

  const loadMovies = async () => {
    try {
      const res = await fetch("http://localhost:5086/api/movies");
      const data = await res.json();
      setMovies(data);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:5086/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Movie added");
      setIsAddOpen(false);
      loadMovies();
    } catch {
      toast.error("Create failed");
    }
  };

  const openEdit = (movie: any) => {
    setEditMovieId(movie.movieId);
    setForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      durationMin: movie.durationMin,
      rating: movie.rating,
      releaseDate: movie.releaseDate.split("T")[0],
      coverImageUrl: movie.coverImageUrl,
    });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5086/api/movies/${editMovieId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Updated");
      setIsEditOpen(false);
      loadMovies();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5086/api/movies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Deleted");
      loadMovies();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-2xl">Admin Panel</h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/login")} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies">
          <TabsList>
            <TabsTrigger value="movies">Movies</TabsTrigger>
          </TabsList>

          <TabsContent value="movies">
            <div className="flex justify-between mb-4">
              <h2 className="text-white text-2xl">Manage Movies</h2>
              <Button className="bg-purple-600" onClick={() => setIsAddOpen(true)}>
                <Plus />
                Add Movie
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent>
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Genre</TableHead>
                        <TableHead className="text-gray-300">Duration</TableHead>
                        <TableHead className="text-gray-300">Rating</TableHead>
                        <TableHead className="text-gray-300">Release</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {movies.map((m: any) => (
                        <TableRow key={m.movieId}>
                          <TableCell className="text-white">{m.title}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-600">{m.genre}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {m.durationMin} min
                          </TableCell>
                          <TableCell className="text-gray-300">{m.rating}</TableCell>
                          <TableCell className="text-gray-300">
                            {m.releaseDate.split("T")[0]}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" onClick={() => openEdit(m)}>
                              <Pencil />
                            </Button>
                            <Button variant="ghost" onClick={() => handleDelete(m.movieId)}>
                              <Trash2 className="text-red-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ADD MOVIE */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Add Movie</DialogTitle>
          </DialogHeader>

          {Object.keys(emptyMovieForm).map((key) => (
            <div key={key} className="mb-3">
              <Label>{key}</Label>
              <Input
                className="bg-gray-900 border-gray-700"
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <Button className="bg-purple-600 w-full" onClick={handleAdd}>
            Add Movie
          </Button>
        </DialogContent>
      </Dialog>

      {/* EDIT MOVIE */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
          </DialogHeader>

          {Object.keys(emptyMovieForm).map((key) => (
            <div key={key} className="mb-3">
              <Label>{key}</Label>
              <Input
                className="bg-gray-900 border-gray-700"
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <Button className="bg-purple-600 w-full" onClick={handleEdit}>
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default AdminPanel;
