import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { Movie } from './MovieSelectionScreen';

interface PaymentScreenProps {
  movie: Movie;
  showtime: string;
  seats: string[];
  total: number;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentScreen({
  movie,
  showtime,
  seats,
  total,
  onBack,
  onPaymentSuccess,
}: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="text-white gap-2" disabled={processing}>
            <ArrowLeft className="w-4 h-4" />
            Back to Seats
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl mb-8">Payment</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Method */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Select Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      {/* PayPal */}
                      <div className="flex items-center space-x-3 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Credit Card</p>
                              <p className="text-gray-400 text-sm">
                                Pay securely with your Credit Card
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      {/* PayPal */}
                      <div className="flex items-center space-x-3 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">PayPal</p>
                              <p className="text-gray-400 text-sm">
                                Pay securely with your PayPal account
                              </p>
                            </div>
                            <div className="bg-blue-600 text-white px-3 py-1 rounded">
                              PayPal
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* Venmo */}
                      <div className="flex items-center space-x-3 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors">
                        <RadioGroupItem value="venmo" id="venmo" />
                        <Label htmlFor="venmo" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Venmo</p>
                              <p className="text-gray-400 text-sm">
                                Fast and easy payment with Venmo
                              </p>
                            </div>
                            <div className="bg-sky-500 text-white px-3 py-1 rounded">
                              Venmo
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">
                      Note: This is a demo application. No actual payment will be processed.
                    </p>
                    <p className="text-gray-400 text-sm">
                      In a production environment, this would integrate with {paymentMethod === 'paypal' ? 'PayPal' : 'Venmo'} API for secure payment processing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Movie</p>
                    <p className="text-white">{movie.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Showtime</p>
                    <p className="text-white">{showtime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Seats</p>
                    <p className="text-white">{seats.join(', ')}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Booking Fee</span>
                      <span className="text-white">$2.50</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-white">Total</span>
                      <span className="text-white text-xl">${(total + 2.50).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${(total + 2.50).toFixed(2)}`
                    )}
                  </Button>
                  <p className="text-gray-400 text-xs text-center">
                    By confirming payment, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
