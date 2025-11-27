import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { Movie } from "./MovieSelectionScreen";

interface SeatSelectionScreenProps {
  movie: Movie;
  onBack: () => void;
  onConfirm: (showtimeId: number, showtime: string, seats: string[], total: number) => void;
}

interface BackendShowtime {
  showtimeId: number;
  movieId: number;
  theaterId: number;
  showDateTime: string;
  screenNumber: number;
  basePrice: number;
}

interface BackendSeat {
  seatId: number;
  theaterId: number;
  screenNumber: number;
  seatNumber: number;
  seatType: string;
}

interface Seat {
  id: string;
  backendId: number;
  row: string;
  number: number;
  status: "available" | "occupied" | "selected";
}

export function SeatSelectionScreen({ movie, onBack, onConfirm }: SeatSelectionScreenProps) {
  // Real backend data
  const [showtimes, setShowtimes] = useState<BackendShowtime[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<BackendShowtime | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch showtimes for the selected movie
  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const res = await fetch("http://localhost:5086/api/showtimes");
        const data = await res.json();

        const filtered = data.filter((s: BackendShowtime) => s.movieId === movie.movieId);
        setShowtimes(filtered);

        if (filtered.length > 0) {
          setSelectedShowtime(filtered[0]);
        }
      } catch (err) {
        console.error("Error loading showtimes", err);
      }
    };

    loadShowtimes();
  }, [movie.movieId]);

  // Fetch seats for the showtime's theater and screen
  useEffect(() => {
    if (!selectedShowtime) return;

    const loadSeats = async () => {
      try {
        const res = await fetch("http://localhost:5086/api/seats");
        const data = await res.json();

        const filtered = data.filter(
          (s: BackendSeat) =>
            s.theaterId === selectedShowtime.theaterId &&
            s.screenNumber === selectedShowtime.screenNumber
        );

        // Convert backend seats to UI seats
        const uiSeats: Seat[] = filtered.map((seat: BackendSeat) => {
          const row = String.fromCharCode(64 + Math.ceil(seat.seatNumber / 10)); // A, B, C...
          const num = ((seat.seatNumber - 1) % 10) + 1;

          const isOccupied = Math.random() < 0.25; // Simulated since backend has no booking table

          return {
            id: `${row}${num}`,
            backendId: seat.seatId,
            row,
            number: num,
            status: isOccupied ? "occupied" : "available",
          };
        });

        setSeats(uiSeats);
      } catch (err) {
        console.error("Error loading seats", err);
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [selectedShowtime]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId && s.status !== "occupied"
          ? { ...s, status: s.status === "selected" ? "available" : "selected" }
          : s
      )
    );
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.length * (selectedShowtime?.basePrice ?? 10);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Loading seats & showtimes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="text-white gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Movie Info */}
        <div className="mb-8">
          <h1 className="text-white text-3xl mb-2">{movie.title}</h1>
          <Badge className="bg-purple-600">{movie.genre}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Showtimes */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Showtime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {showtimes.map((s) => (
                    <Button
                      key={s.showtimeId}
                      variant={
                        selectedShowtime?.showtimeId === s.showtimeId
                          ? "default"
                          : "outline"
                      }
                      className={
                        selectedShowtime?.showtimeId === s.showtimeId
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }
                      onClick={() => setSelectedShowtime(s)}
                    >
                      {new Date(s.showDateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seat Map */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select Your Seats
                </CardTitle>
              </CardHeader>
              <CardContent>

                {/* Screen */}
                <div className="mb-8">
                  <div className="bg-gradient-to-t from-purple-500/50 to-transparent h-2 rounded-full mb-2"></div>
                  <p className="text-center text-gray-400 text-sm">Screen</p>
                </div>

                {/* Seats Grid */}
                <div className="space-y-3">
                  {["A","B","C","D","E","F","G","H"].map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="text-gray-400 w-6">{row}</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {seats
                          .filter((s) => s.row === row)
                          .map((s) => (
                            <button
                              key={s.id}
                              onClick={() => handleSeatClick(s.id)}
                              disabled={s.status === "occupied"}
                              className={`w-8 h-8 rounded-t-lg transition-colors ${
                                s.status === "available"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : s.status === "occupied"
                                  ? "bg-gray-600 cursor-not-allowed"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              title={`Seat ${s.id}`}
                            ></button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">
                  Booking Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div>
                  <p className="text-gray-400 text-sm mb-1">Movie</p>
                  <p className="text-white">{movie.title}</p>
                </div>

                {selectedShowtime && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Showtime</p>
                    <p className="text-white">
                      {new Date(selectedShowtime.showDateTime).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-sm mb-1">Selected Seats</p>
                  <p className="text-white">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(", ")
                      : "No seats selected"}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">
                      Seats ({selectedSeats.length})
                    </span>
                    <span className="text-white">
                      ${(totalPrice).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white">Total</span>
                    <span className="text-white text-xl">
                      ${(totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  disabled={selectedSeats.length === 0}
                  onClick={() =>
                    onConfirm(
                      selectedShowtime!.showtimeId,
                      new Date(selectedShowtime!.showDateTime).toLocaleString(),
                      selectedSeats.map((s) => s.id),
                      totalPrice
                    )
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue to Payment
                </Button>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
