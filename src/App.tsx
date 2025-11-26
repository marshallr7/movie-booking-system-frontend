import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MovieSelectionScreen, Movie } from './components/MovieSelectionScreen';
import { SeatSelectionScreen } from './components/SeatSelectionScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { TicketScreen } from './components/TicketScreen';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';

type Screen = 'login' | 'movies' | 'seats' | 'payment' | 'ticket' | 'admin';

interface BookingData {
  movie: Movie | null;
  showtime: string;
  seats: string[];
  total: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    movie: null,
    showtime: '',
    seats: [],
    total: 0,
  });

  const handleLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setCurrentScreen(adminStatus ? 'admin' : 'movies');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setIsAdmin(false);
    setBookingData({
      movie: null,
      showtime: '',
      seats: [],
      total: 0,
    });
  };

  const handleSelectMovie = (movie: Movie) => {
    setBookingData({ ...bookingData, movie });
    setCurrentScreen('seats');
  };

  const handleConfirmSeats = (showtime: string, seats: string[], total: number) => {
    setBookingData({ ...bookingData, showtime, seats, total });
    setCurrentScreen('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentScreen('ticket');
  };

  const handleBackToHome = () => {
    setBookingData({
      movie: null,
      showtime: '',
      seats: [],
      total: 0,
    });
    setCurrentScreen('movies');
  };

  return (
    <>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'movies' && (
        <MovieSelectionScreen onSelectMovie={handleSelectMovie} onLogout={handleLogout} />
      )}
      
      {currentScreen === 'seats' && bookingData.movie && (
        <SeatSelectionScreen
          movie={bookingData.movie}
          onBack={() => setCurrentScreen('movies')}
          onConfirm={handleConfirmSeats}
        />
      )}
      
      {currentScreen === 'payment' && bookingData.movie && (
        <PaymentScreen
          movie={bookingData.movie}
          showtime={bookingData.showtime}
          seats={bookingData.seats}
          total={bookingData.total}
          onBack={() => setCurrentScreen('seats')}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      
      {currentScreen === 'ticket' && bookingData.movie && (
        <TicketScreen
          movie={bookingData.movie}
          showtime={bookingData.showtime}
          seats={bookingData.seats}
          total={bookingData.total}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentScreen === 'admin' && <AdminPanel onLogout={handleLogout} />}
      
      <Toaster />
    </>
  );
}
