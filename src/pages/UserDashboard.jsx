import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { eventAPI, userAPI, paymentAPI } from '../api/api';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import QueryModal from '../components/QueryModal';
import PaymentModal from '../components/PaymentModal';
import GreetingCard from '../components/GreetingCard';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [payments, setPayments] = useState({});
  const [showGreetingCard, setShowGreetingCard] = useState(false);
  const [greetingCardBooking, setGreetingCardBooking] = useState(null);
  const [greetingCardEvent, setGreetingCardEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    loadBookings();
    loadQueries();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await userAPI.getUserBookings(user.id);
      setBookings(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to load bookings');
      return [];
    }
  };

  const loadQueries = async () => {
    try {
      const response = await userAPI.getUserQueries(user.id);
      setQueries(response.data);
    } catch (error) {
      toast.error('Failed to load queries');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadEvents();
      return;
    }

    try {
      setLoading(true);
      const response = await eventAPI.searchEvents(searchQuery);
      setEvents(response.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = (event) => {
    // Check if user already has a booking for this event
    const existingBooking = bookings.find(b => b.event.id === event.id);
    
    if (existingBooking) {
      if (existingBooking.status === 'APPROVED' && existingBooking.paymentStatus === 'NOT_PAID') {
        // Show payment modal for approved but unpaid booking (advance payment)
        setSelectedBookingForPayment(existingBooking);
        setShowPaymentModal(true);
        toast.info('Your booking is approved! Please make the advance payment.');
      } else if (existingBooking.status === 'APPROVED' && existingBooking.paymentStatus === 'PARTIALLY_PAID') {
        // Show payment modal for approved but partially paid booking (final payment)
        setSelectedBookingForPayment(existingBooking);
        setShowPaymentModal(true);
        toast.info('Your booking is approved! Please make the final payment.');
      } else {
        toast.info(`You already have a ${existingBooking.status.toLowerCase()} booking for this event.`);
      }
      return;
    }
    
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleRaiseQuery = (event) => {
    setSelectedEvent(event);
    setShowQueryModal(true);
  };

  const confirmBooking = async (selectedEventDate, selectedEventTime, selectedVenue, hostName) => {
    try {
      const response = await userAPI.createBooking(user.id, selectedEvent.id, selectedEventDate, selectedEventTime, selectedVenue, hostName);
      setNewBooking(response.data);
      toast.success('Event booked successfully!');
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
      setShowBookingModal(false);
    }
  };

  const submitQuery = async (question) => {
    try {
      await userAPI.createQuery(user.id, selectedEvent.id, question);
      toast.success('Query submitted successfully!');
      setShowQueryModal(false);
      loadQueries();
    } catch (error) {
      toast.error('Failed to submit query');
    }
  };

  const loadPayments = async (bookingId) => {
    try {
      const response = await paymentAPI.getPaymentsByBooking(bookingId);
      setPayments(prev => ({ ...prev, [bookingId]: response.data }));
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const toggleExpanded = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
      if (!payments[bookingId]) {
        loadPayments(bookingId);
      }
    }
  };

  const handleFinalPayment = (booking) => {
    setSelectedBookingForPayment(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (wasAdvancePayment) => {
    setShowPaymentModal(false);
    setSelectedBookingForPayment(null);
    loadBookings();
    if (expandedBooking) {
      loadPayments(expandedBooking);
    }
    
    // Show greeting card after successful advance payment
    if (wasAdvancePayment) {
      toast.success('Advance payment successful!');
    } else {
      toast.success('Final payment successful!');
    }
  };

  const filteredEvents = events;

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const colors = {
      NOT_PAID: 'bg-red-100 text-red-800',
      PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
      FULLY_PAID: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Chatbot />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting Card Modal */}
        {showGreetingCard && greetingCardBooking && greetingCardEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-2xl w-full">
              <button
                onClick={() => setShowGreetingCard(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
              <GreetingCard 
                event={greetingCardEvent} 
                booking={greetingCardBooking} 
              />
            </div>
          </div>
        )}

        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome, {user.name}!</h1>
          <p className="text-white/90 drop-shadow">Discover and book amazing events</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'events'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'bookings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'queries'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Queries
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {/* Search Bar */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search events by title or location..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No events found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onBook={handleBookEvent}
                    onQuery={handleRaiseQuery}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <React.Fragment key={booking.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{booking.event.title}</div>
                            {/* Removed automatically generated date and venue */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ₹{booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Date: {booking.selectedEventDate ? new Date(booking.selectedEventDate).toLocaleDateString() : 'N/A'}</div>
                              <div>Time: {booking.selectedEventTime || 'N/A'}</div>
                              <div>Venue: {booking.selectedVenue || 'N/A'}</div>
                              <div>Host: {booking.hostName || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                              {booking.paymentStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => toggleExpanded(booking.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              {expandedBooking === booking.id ? 'Hide' : 'View'} Details
                            </button>
                          </td>
                        </tr>
                        {expandedBooking === booking.id && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                  <h4 className="font-semibold text-gray-800 mb-3">Event Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Selected Date:</span>
                                      <span className="font-semibold">{booking.selectedEventDate ? new Date(booking.selectedEventDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Selected Time:</span>
                                      <span className="font-semibold">{booking.selectedEventTime || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Selected Venue:</span>
                                      <span className="font-semibold">{booking.selectedVenue || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Host Name:</span>
                                      <span className="font-semibold">{booking.hostName || 'N/A'}</span>
                                    </div>
                                    {/* Removed Original Date and Original Location */}
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg shadow">
                                  <h4 className="font-semibold text-gray-800 mb-3">Payment Breakdown</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Amount:</span>
                                      <span className="font-semibold">₹{booking.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Advance (40%):</span>
                                      <span className="font-semibold">₹{booking.advanceAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Final (60%):</span>
                                      <span className="font-semibold">₹{booking.finalAmount}</span>
                                    </div>
                                  </div>
                                  
                                  {booking.status === 'APPROVED' && booking.paymentStatus === 'NOT_PAID' && (
                                    <button
                                      onClick={() => handleFinalPayment(booking)}
                                      className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                      💳 Pay Advance Amount (₹{booking.advanceAmount})
                                    </button>
                                  )}
                                  
                                  {booking.paymentStatus === 'PARTIALLY_PAID' && (
                                    <button
                                      onClick={() => handleFinalPayment(booking)}
                                      className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                                    >
                                      Pay Final Amount (₹{booking.finalAmount})
                                    </button>
                                  )}
                                  
                                  {booking.paymentStatus === 'FULLY_PAID' && (
                                    <button
                                      onClick={() => {
                                        setGreetingCardBooking(booking);
                                        setGreetingCardEvent(booking.event);
                                        setShowGreetingCard(true);
                                      }}
                                      className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                                    >
                                      View Greeting Card
                                    </button>
                                  )}
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                                  <h4 className="font-semibold text-gray-800 mb-3">Payment History</h4>
                                  {payments[booking.id] && payments[booking.id].length > 0 ? (
                                    <div className="space-y-2">
                                      {payments[booking.id].map((payment) => (
                                        <div key={payment.id} className="text-sm border-l-4 border-green-500 pl-3 py-1">
                                          <div className="flex justify-between">
                                            <span className="font-medium">{payment.paymentType}</span>
                                            <span className="text-green-600 font-semibold">₹{payment.amountPaid}</span>
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {payment.status} - {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No payments yet</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Queries Tab */}
        {activeTab === 'queries' && (
          <div className="space-y-4">
            {queries.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">No queries yet</p>
              </div>
            ) : (
              queries.map((query) => (
                <div key={query.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">{query.event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(query.queryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium mb-1">Your Question:</p>
                    <p className="text-gray-800">{query.question}</p>
                  </div>
                  {query.response ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-sm text-green-800 font-medium mb-1">Admin Response:</p>
                      <p className="text-green-900">{query.response}</p>
                      <p className="text-xs text-green-700 mt-2">
                        Responded on: {new Date(query.responseDate).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-yellow-800">Waiting for admin response...</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setNewBooking(null);
        }}
        onConfirm={confirmBooking}
        event={selectedEvent}
        newBooking={newBooking}
      />

      <QueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        onSubmit={submitQuery}
        event={selectedEvent}
      />

      {showPaymentModal && selectedBookingForPayment && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={selectedBookingForPayment}
          paymentType={selectedBookingForPayment.paymentStatus === 'NOT_PAID' ? 'ADVANCE' : 'FINAL'}
          amount={parseFloat(
            selectedBookingForPayment.paymentStatus === 'NOT_PAID' 
              ? selectedBookingForPayment.advanceAmount 
              : selectedBookingForPayment.finalAmount
          )}
          userId={user?.id}
          onPaymentSuccess={(wasAdvancePayment) => handlePaymentSuccess(wasAdvancePayment)}
        />
      )}
    </div>
  );
};

export default UserDashboard;