import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, onConfirm, event, newBooking }) => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState('');
  const [selectedEventTime, setSelectedEventTime] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [hostName, setHostName] = useState('');

  if (!isOpen || !event) return null;

  const handleConfirmBooking = async () => {
    // Validate required fields
    if (!selectedEventDate || !selectedEventTime || !selectedVenue || !hostName) {
      alert('Please fill in all required fields: Event Date, Time, Venue, and Host Name');
      return;
    }
    
    await onConfirm(selectedEventDate, selectedEventTime, selectedVenue, hostName);
    setBookingCreated(true);
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setBookingCreated(false);
    onClose();
  };

  const advanceAmount = event.price ? (event.price * 0.4).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Booking</h2>
        
        <div className="mb-6">
          {!bookingCreated ? (
            <>
              <p className="text-gray-600 mb-4">
                Review the event details and payment information before booking:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Total Cost:</strong> ₹{event.price}
                </p>
              </div>
              
              {/* User Selection Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Event Date *
                </label>
                <input
                  type="date"
                  value={selectedEventDate}
                  onChange={(e) => setSelectedEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Event Time *
                </label>
                <input
                  type="time"
                  value={selectedEventTime}
                  onChange={(e) => setSelectedEventTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Venue *
                </label>
                <input
                  type="text"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  placeholder="Enter venue for the event"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host Name *
                </label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter host name for the event"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Payment Structure:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  • Advance Payment (40%): <strong>₹{advanceAmount}</strong>
                </p>
                <p className="text-sm text-blue-700">
                  • Final Payment (60%): ₹{(event.price - advanceAmount).toFixed(2)} (After event completion)
                </p>
              </div>
            </>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-800 font-semibold mb-2">Booking Created Successfully!</p>
              <p className="text-green-700 text-sm mb-4">
                Please proceed with the advance payment of ₹{advanceAmount} to confirm your booking.
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          {!bookingCreated ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Confirm Booking
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Pay Later
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Pay Advance Now
              </button>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && newBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={newBooking}
          paymentType="ADVANCE"
          amount={parseFloat(advanceAmount)}
          userId={user?.id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BookingModal;