import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { API_URL } from "../../config";

export default function SeatSelectionScreen() {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load movie
  useEffect(() => {
    fetch(`${API_URL}movies`)
      .then((r) => r.json())
      .then((data) => {
        const m = data.find((x: any) => x.movieId === Number(movieId));
        setMovie(m);
      });
  }, [movieId]);

  // Load showtimes
  useEffect(() => {
    fetch(`${API_URL}showtimes`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter((s: any) => s.movieId === Number(movieId));
        setShowtimes(filtered);
        setSelectedShowtime(filtered[0]);
      });
  }, [movieId]);

  // Load seats
  useEffect(() => {
    if (!selectedShowtime) return;

    fetch(`${API_URL}seats`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.filter(
          (s: any) =>
            s.theaterId === selectedShowtime.theaterId &&
            s.screenNumber === selectedShowtime.screenNumber
        );

        // Your seats: backendId, label, status
        setSeats(
          filtered.map((seat: any) => ({
            backendId: seat.seatId,
            label: seat.seatNumber,
            status: "available",
          }))
        );

        setLoading(false);
      });
  }, [selectedShowtime]);

  const toggleSeat = (id: number) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.backendId === id
          ? { ...s, status: s.status === "selected" ? "available" : "selected" }
          : s
      )
    );
  };

  const selected = seats.filter((s) => s.status === "selected");

  if (loading || !movie)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10">
        Loading...
      </div>
    );

  // Generate ROWS 
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 10;

  // Convert flat seats into rows
  const grid = rows.map((row, rowIndex) => {
    const startIndex = rowIndex * seatsPerRow;
    return {
      row,
      seats: seats.slice(startIndex, startIndex + seatsPerRow),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Button onClick={() => navigate(-1)} className="mb-6 bg-gray-900">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        <h1 className="text-4xl mb-3 font-bold">{movie.title}</h1>
        <Badge className="bg-purple-600">{movie.genre}</Badge>

        {/* SHOWTIMES */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Select Showtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {showtimes.map((s) => (
                <Button
                  key={s.showtimeId}
                  variant={
                    selectedShowtime?.showtimeId === s.showtimeId
                      ? "default"
                      : "outline"
                  }
                  className="px-6 py-2"
                  onClick={() => setSelectedShowtime(s)}
                >
                  {new Date(s.showDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEATS */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Select Seats
            </CardTitle>
          </CardHeader>

          <CardContent>

            {/* Screen bar */}
            <div className="mb-10">
              <div className="bg-gradient-to-t from-purple-500/50 to-transparent h-2 rounded-full mb-2"></div>
              <p className="text-center text-gray-400 text-sm">Screen</p>
            </div>

            {/* Seat rows */}
            <div className="space-y-6">
              {grid.map((rowObj, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* Row label */}
                  <span className="text-gray-400 w-6 text-lg">{rowObj.row}</span>

                  {/* Row seats */}
                  <div className="flex gap-2 flex-1 justify-center">
                    {rowObj.seats.map((seat) => (
                      <button
                        key={seat.backendId}
                        onClick={() => toggleSeat(seat.backendId)}
                        className={`
                          w-8 h-8 rounded-t-lg transition
                          ${
                            seat.status === "selected"
                              ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
                              : "bg-green-500 hover:bg-green-600"
                          }
                        `}
                      ></button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Continue button */}
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 mt-8 py-4 text-lg font-semibold"
          disabled={selected.length === 0}
          onClick={() =>
            navigate("/payment", {
              state: {
                movie,
                showtime: selectedShowtime,
                seats: selected,
              },
            })
          }
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
