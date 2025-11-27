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
  showtimeId: number | null;
  showtimeLabel: string;
  seats: string[];
  total: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAdmin, setIsAdmin] = useState(false);

  const [bookingData, setBookingData] = useState<BookingData>({
    movie: null,
    showtimeId: null,
    showtimeLabel: '',
    seats: [],
    total: 0,
  });

  // --------------------------
  // LOGIN
  // --------------------------
  const handleLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setCurrentScreen(adminStatus ? 'admin' : 'movies');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setIsAdmin(false);
    setBookingData({
      movie: null,
      showtimeId: null,
      showtimeLabel: '',
      seats: [],
      total: 0,
    });
  };

  // --------------------------
  // MOVIE SELECT → SEATS
  // --------------------------
  const handleSelectMovie = (movie: Movie) => {
    setBookingData({
      ...bookingData,
      movie,
    });
    setCurrentScreen('seats');
  };

  // --------------------------
  // SEATS SELECTED → PAYMENT
  // from SeatSelectionScreen:
  //   showtimeId
  //   showtimeLabel
  //   seats
  //   total
  // --------------------------
  const handleConfirmSeats = (
    showtimeId: number,
    showtimeLabel: string,
    seats: string[],
    total: number
  ) => {
    setBookingData({
      ...bookingData,
      showtimeId,
      showtimeLabel,
      seats,
      total,
    });
    setCurrentScreen('payment');
  };

  // --------------------------
  // PAYMENT → TICKET
  // --------------------------
  const handlePaymentSuccess = () => {
    setCurrentScreen('ticket');
  };

  const handleBackToHome = () => {
    setBookingData({
      movie: null,
      showtimeId: null,
      showtimeLabel: '',
      seats: [],
      total: 0,
    });
    setCurrentScreen('movies');
  };

  // --------------------------
  // RENDER SCREENS
  // --------------------------
  return (
    <>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}

      {currentScreen === 'movies' && (
        <MovieSelectionScreen
          onSelectMovie={handleSelectMovie}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'seats' && bookingData.movie && (
        <SeatSelectionScreen
          movie={bookingData.movie}
          onBack={() => setCurrentScreen('movies')}
          onConfirm={handleConfirmSeats}
        />
      )}

      {currentScreen === 'payment' &&
        bookingData.movie &&
        bookingData.showtimeId !== null && (
          <PaymentScreen
            movie={bookingData.movie}
            showtime={bookingData.showtimeLabel}
            seats={bookingData.seats}
            total={bookingData.total}
            onBack={() => setCurrentScreen('seats')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

      {currentScreen === 'ticket' &&
        bookingData.movie &&
        bookingData.showtimeId !== null && (
          <TicketScreen
            movie={bookingData.movie}
            showtime={bookingData.showtimeLabel}
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
