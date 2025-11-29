import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Loader2, ArrowLeft } from "lucide-react";

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const movie = state?.movie;
  const showtime = state?.showtime;
  const seats = state?.seats ?? [];

  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    const body = {
      userId: 1,
      showtimeId: showtime.showtimeId,
      totalAmount: 10 * seats.length,
      paymentStatus: "completed",
      paymentMethod: "credit",
      seatIds: seats.map((s: any) => s.backendId),
    };

    const res = await fetch("http://localhost:5086/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    navigate("/ticket", {
      state: {
        movie,
        showtime,
        seats,
        bookingId: result.bookingId ?? 0,
        total: body.totalAmount,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* BACK BUTTON */}
        <Button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-900 hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        <h1 className="text-4xl font-bold mb-6">Payment</h1>

        {/* SUMMARY CARD */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300 text-lg">

            <p>
              <span className="font-semibold text-white">Movie:</span>{" "}
              {movie?.title}
            </p>

            <p>
              <span className="font-semibold text-white">Showtime:</span>{" "}
              {new Date(showtime.showDateTime).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold text-white">Seats:</span>{" "}
              {seats.map((s: any) => s.label).join(", ")}
            </p>

            <p className="text-xl font-bold text-purple-400">
              Total: ${10 * seats.length}
            </p>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg font-semibold mt-4"
              disabled={processing}
              onClick={handlePayment}
            >
              {processing ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Pay Now"
              )}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
