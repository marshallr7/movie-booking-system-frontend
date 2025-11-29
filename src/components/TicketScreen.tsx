import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ArrowLeft } from "lucide-react";

export default function TicketScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>No booking data found.</p>
      </div>
    );
  }

  const { movie, showtime, seats, bookingId, total } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">

      {/* BACK BUTTON */}
      <Button
        onClick={() => navigate("/movies")}
        className="mb-8 bg-gray-900 hover:bg-gray-800"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Movies
      </Button>

      {/* CENTERED CARD */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 shadow-2xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-400">
              Booking Confirmation
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-300 text-lg">

            <div>
              <p className="font-semibold text-white mb-1">Booking ID</p>
              <p className="text-purple-400 font-bold">#{bookingId}</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Movie</p>
              <p>{movie?.title}</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Showtime</p>
              <p>{new Date(showtime.showDateTime).toLocaleString()}</p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Seats</p>
              <p className="text-purple-300 font-semibold">
                {seats.map((s: any) => s.label).join(", ")}
              </p>
            </div>

            <div>
              <p className="font-semibold text-white mb-1">Total Paid</p>
              <p className="text-green-400 text-xl font-bold">${total}</p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Show this ticket at the entrance.
              </p>
            </div>

            {/* BUTTON */}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg font-semibold mt-4"
              onClick={() => navigate("/movies")}
            >
              Back to Movies
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
