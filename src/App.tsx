import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginScreen from "./components/LoginScreen";
import MovieSelectionScreen from "./components/MovieSelectionScreen";
import SeatSelectionScreen from "./components/SeatSelectionScreen";
import PaymentScreen from "./components/PaymentScreen";
import TicketScreen from "./components/TicketScreen";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />   {/* <-- FIX */}

        {/* Movies */}
        <Route path="/movies" element={<MovieSelectionScreen />} />

        {/* Seat selection */}
        <Route path="/seats/:movieId" element={<SeatSelectionScreen />} />

        {/* Payment */}
        <Route path="/payment" element={<PaymentScreen />} />

        {/* Ticket */}
        <Route path="/ticket" element={<TicketScreen />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPanel />} />

      </Routes>
    </Router>
  );
}
