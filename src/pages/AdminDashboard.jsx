import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { adminAPI, eventAPI, paymentAPI } from '../api/api';
import Navbar from '../components/Navbar';
import EventManagement from '../components/EventManagement';
import BookingManagement from '../components/BookingManagement';
import QueryManagement from '../components/QueryManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadDashboardStats();
    loadAllPayments();
    
    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      loadDashboardStats();
      loadAllPayments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadAllPayments = async () => {
    try {
      const response = await paymentAPI.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const calculatePaymentStats = () => {
    const totalRevenue = payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + parseFloat(p.amountPaid), 0);
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    return { totalRevenue, pendingPayments };
  };

  const paymentStats = calculatePaymentStats();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-white/90 drop-shadow">Manage events, bookings, and queries</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Event Management
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`pb-3 px-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'queries'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Queries
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Events</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalEvents}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending Bookings</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Approved Bookings</p>
                      <p className="text-3xl font-bold text-green-600">{stats.approvedBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Queries</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalQueries}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Unanswered Queries</p>
                      <p className="text-3xl font-bold text-red-600">{stats.unansweredQueries}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">₹{paymentStats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Recent Payments Section */}
            {!loading && payments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Payments</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.slice(0, 10).map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{payment.user.name}</div>
                              <div className="text-sm text-gray-500">{payment.user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              ₹{payment.amountPaid}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.paymentType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Event Management Tab */}
        {activeTab === 'events' && <EventManagement />}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && <BookingManagement />}

        {/* Queries Tab */}
        {activeTab === 'queries' && <QueryManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
