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
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-3xl mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Your tickets have been booked successfully</p>
          </div>

          {/* Digital Ticket */}
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
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Date & Time</p>
                      <p className="text-white">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-white">{showtime}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Seats</p>
                      <p className="text-white">{seats.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Number of Tickets</p>
                      <p className="text-white">{seats.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Theater</p>
                      <p className="text-white">Movie Booking System Theater - Screen 1</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <QRCode value={qrCodeData} size={180} />
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Scan this QR code at the theater entrance
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount Paid</span>
                  <span className="text-white text-xl">${(total + 2.50).toFixed(2)}</span>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-gray-900 p-4 rounded-lg mb-6">
                <p className="text-yellow-400 text-sm mb-2">Important Information:</p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>Please arrive 15 minutes before showtime</li>
                  <li>This QR code is your ticket - no need to print</li>
                  <li>Valid for the date and time shown above</li>
                  <li>Outside food and beverages are not permitted</li>
                </ul>
              </div>

              {/* Action Buttons */}
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
