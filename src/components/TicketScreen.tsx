import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Download, Mail, Home } from 'lucide-react';
import { Movie } from './MovieSelectionScreen';
import QRCode from 'react-qr-code';

interface TicketScreenProps {
  movie: Movie;
  showtime: string;
  seats: string[];
  total: number;
  onBackToHome: () => void;
}

export function TicketScreen({
  movie,
  showtime,
  seats,
  total,
  onBackToHome,
}: TicketScreenProps) {
  const bookingId = `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const qrCodeData = JSON.stringify({
    bookingId,
    movie: movie.title,
    showtime,
    seats,
    total: (total + 2.50).toFixed(2),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-3xl mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Your tickets have been booked successfully</p>
          </div>

          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Booking ID</p>
                  <p className="text-white text-xl">{bookingId}</p>
                </div>
                <Badge className="bg-white text-purple-600">E-Ticket</Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-white text-2xl mb-4">{movie.title}</h2>
                  <p className="text-gray-400 text-sm">Showtime</p>
                  <p className="text-white">{showtime}</p>
                  <p className="text-gray-400 text-sm mt-4">Seats</p>
                  <p className="text-white">{seats.join(', ')}</p>
                  <p className="text-gray-400 text-sm mt-4">Total Paid</p>
                  <p className="text-white text-xl">${(total + 2.50).toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <QRCode value={qrCodeData} size={180} />
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Scan this QR code at the theater entrance
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Ticket
                </Button>
                <Button
                  onClick={onBackToHome}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
