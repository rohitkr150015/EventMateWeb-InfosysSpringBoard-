import React, { useState } from 'react';
import { paymentAPI } from '../api/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  paymentType, 
  amount, 
  userId, 
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    console.log('Payment process started');
    console.log('Booking data:', booking);
    console.log('Booking ID:', booking?.id);
    console.log('Payment Type:', paymentType);
    console.log('Amount:', amount);
    
    if (!booking || !booking.id) {
      toast.error('Invalid booking data. Please try again.');
      console.error('Booking data is missing or invalid:', booking);
      return;
    }

    // Simple validation
    if (!cardDetails.cardHolderName) {
      toast.error('Please enter cardholder name');
      return;
    }

    // Accept any card number (dummy payment system)
    // In a real system, we would validate the card details properly
    setLoading(true);
    setProcessing(true);
    
    try {
      // Simulate payment processing delay (15 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Create payment data
      const paymentData = {
        bookingId: booking.id,
        amount: typeof amount === 'object' ? amount.toString() : amount,
        paymentType: paymentType,
        payeeName: cardDetails.cardHolderName,
        transactionId: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
      };
      
      // Ensure amount is a proper decimal value
      if (typeof paymentData.amount !== 'number') {
        paymentData.amount = parseFloat(paymentData.amount);
      }
      
      // If still not a valid number, use booking amounts as fallback
      if (isNaN(paymentData.amount)) {
        if (paymentType === 'ADVANCE') {
          paymentData.amount = parseFloat(booking.advanceAmount);
        } else {
          paymentData.amount = parseFloat(booking.finalAmount);
        }
      }

      console.log('Creating payment with data:', paymentData);
      const response = await paymentAPI.createOrder(paymentData, userId);
      console.log('Payment created:', response.data);

      toast.success('Payment successful! 🎉');
      // Pass payment type information to parent component
      onPaymentSuccess(paymentType === 'ADVANCE');
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to process payment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  if (!isOpen) return null;
  
  // Add safety check for booking data
  if (!booking) {
    console.error('PaymentModal opened without booking data');
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-4">Invalid booking data. Please try again.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {processing ? (
          // Processing screen
          <div className="text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-12 h-12 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600 mb-6">Please wait while we securely process your payment</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="ml-2 font-bold text-blue-600">Razorpay</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">Card ending in</p>
                <p className="font-mono text-gray-900">
                  **** **** **** {cardDetails.cardNumber.slice(-4)}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-progress w-3/4"></div>
              </div>
              <p className="text-sm text-gray-600">Securing your payment...</p>
            </div>
          </div>
        ) : (
          // Payment form
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {paymentType === 'ADVANCE' ? 'Advance Payment' : 'Final Payment'}
              </h2>
              <p className="text-gray-600">Secure Card Payment</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Event Details */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Event: {booking.event.title}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <strong>Total Amount:</strong>
                    <p className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</p>
                  </div>
                  {paymentType === 'ADVANCE' && (
                    <div>
                      <strong>Advance (40%):</strong>
                      <p className="text-lg font-bold text-green-600">₹{booking.advanceAmount}</p>
                    </div>
                  )}
                  {paymentType === 'FINAL' && (
                    <div>
                      <strong>Final (60%):</strong>
                      <p className="text-lg font-bold text-green-600">₹{booking.finalAmount}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount to Pay */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">Amount to Pay</p>
                <p className="text-4xl font-bold text-green-600">₹{amount}</p>
              </div>

              {/* Card Payment Form */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-bold text-purple-800">💳 Card Details</h4>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="ml-1 font-bold text-blue-600">Razorpay</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Enter any 16-digit number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={cardDetails.cardHolderName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-300 p-3 rounded-lg flex items-start space-x-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">100% Secure Payment</p>
                  <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Pay Securely</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 75%; }
        }
        .animate-progress {
          animation: progress 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;