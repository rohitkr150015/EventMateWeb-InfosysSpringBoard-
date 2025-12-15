import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, paymentAPI } from '../api/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [payments, setPayments] = useState({});

  useEffect(() => {
    loadBookings();
    
    // Auto-refresh bookings every 15 seconds to show payment updates
    const interval = setInterval(() => {
      loadBookings();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()} successfully!`);
      loadBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
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

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
        <div className="flex space-x-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
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
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <React.Fragment key={booking.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.event.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
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
                          <div className="flex space-x-2">
                            {booking.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                                  className="text-green-600 hover:text-green-900 font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                                  className="text-red-600 hover:text-red-900 font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => toggleExpanded(booking.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              {expandedBooking === booking.id ? 'Hide' : 'View'} Details
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedBooking === booking.id && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-semibold text-gray-800 mb-3">Payment History</h4>
                                {payments[booking.id] && payments[booking.id].length > 0 ? (
                                  <div className="space-y-3">
                                    {payments[booking.id].map((payment) => (
                                      <div key={payment.id} className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <span className="font-bold text-green-700">{payment.paymentType}</span>
                                          <span className="text-green-600 font-bold text-lg">₹{payment.amountPaid}</span>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                          <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full ${
                                              payment.status === 'SUCCESS' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                              {payment.status}
                                            </span>
                                            <span>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</span>
                                          </div>
                                          {payment.payeeName && (
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                              </svg>
                                              <strong className="text-blue-600">Payee:</strong> {payment.payeeName}
                                            </div>
                                          )}
                                          {payment.transactionId && (
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                                              </svg>
                                              <strong className="text-purple-600">Transaction ID:</strong> 
                                              <code className="bg-gray-200 px-1 rounded font-mono">{payment.transactionId}</code>
                                            </div>
                                          )}
                                          {payment.razorpayPaymentId && (
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd"/>
                                              </svg>
                                              <strong>Razorpay ID:</strong> 
                                              <code className="bg-gray-200 px-1 rounded font-mono text-xs">{payment.razorpayPaymentId}</code>
                                            </div>
                                          )}
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
    </div>
  );
};

export default BookingManagement;