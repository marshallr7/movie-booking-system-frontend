import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { Movie } from './MovieSelectionScreen';

interface SeatSelectionScreenProps {
  movie: Movie;
  onBack: () => void;
  onConfirm: (showtime: string, seats: string[], total: number) => void;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
}

const showtimes = ['10:00 AM', '1:30 PM', '4:45 PM', '7:15 PM', '9:45 PM'];

const TICKET_PRICE = 12.50;

export function SeatSelectionScreen({ movie, onBack, onConfirm }: SeatSelectionScreenProps) {
  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[0]);
  const [seats, setSeats] = useState<Seat[]>(() => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const allSeats: Seat[] = [];

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Randomly make some seats occupied
        const isOccupied = Math.random() < 0.3;
        allSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: isOccupied ? 'occupied' : 'available',
        });
      }
    });

    return allSeats;
  });

  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId && seat.status !== 'occupied') {
          return {
            ...seat,
            status: seat.status === 'selected' ? 'available' : 'selected',
          };
        }
        return seat;
      })
    );
  };

  const selectedSeats = seats.filter((seat) => seat.status === 'selected');
  const totalPrice = selectedSeats.length * TICKET_PRICE;

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600 cursor-pointer';
      case 'occupied':
        return 'bg-gray-600 cursor-not-allowed';
      case 'selected':
        return 'bg-purple-600 hover:bg-purple-700 cursor-pointer';
      default:
        return 'bg-gray-400';
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      onConfirm(
        selectedShowtime,
        selectedSeats.map((seat) => seat.id),
        totalPrice
      );
    }
  };

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
          <div className="flex items-center gap-4 text-gray-400">
            <Badge className="bg-purple-600">{movie.genre}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {movie.duration}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Showtimes & Seat Map */}
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
                  {showtimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedShowtime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedShowtime(time)}
                      className={
                        selectedShowtime === time
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }
                    >
                      {time}
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
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="text-gray-400 w-6">{row}</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {seats
                          .filter((seat) => seat.row === row)
                          .map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              disabled={seat.status === 'occupied'}
                              className={`w-8 h-8 rounded-t-lg transition-colors ${getSeatColor(
                                seat.status
                              )}`}
                              title={`Seat ${seat.id}`}
                            ></button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-t-lg"></div>
                    <span className="text-gray-400 text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-t-lg"></div>
                    <span className="text-gray-400 text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-t-lg"></div>
                    <span className="text-gray-400 text-sm">Occupied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Movie</p>
                  <p className="text-white">{movie.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Showtime</p>
                  <p className="text-white">{selectedShowtime}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Selected Seats</p>
                  <p className="text-white">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(', ')
                      : 'No seats selected'}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Seats ({selectedSeats.length})</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Total</span>
                    <span className="text-white text-xl">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleConfirm}
                  disabled={selectedSeats.length === 0}
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
