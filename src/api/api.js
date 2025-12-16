import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  //  baseURL: 'https://eventmate-infosysspringboard.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const eventAPI = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  searchEvents: (query) => api.get(`/events/search?query=${query}`),
  filterByDate: (date) => api.get(`/events/filter/date?date=${date}`),
  filterByLocation: (location) => api.get(`/events/filter/location?location=${location}`),
};

export const userAPI = {
  createBooking: (userId, eventId, selectedEventDate, selectedEventTime, selectedVenue, hostName) => 
    api.post('/user/bookings', { userId, eventId, selectedEventDate, selectedEventTime, selectedVenue, hostName }),
  getUserBookings: (userId) => api.get(`/user/bookings/${userId}`),
  createQuery: (userId, eventId, question) => api.post('/user/queries', { userId, eventId, question }),
  getUserQueries: (userId) => api.get(`/user/queries/${userId}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  createEvent: (event) => api.post('/admin/events', event),
  updateEvent: (id, event) => api.put(`/admin/events/${id}`, event),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  getAllBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  getAllQueries: () => api.get('/admin/queries'),
  respondToQuery: (id, response) => api.put(`/admin/queries/${id}/respond`, { response }),
};

export const paymentAPI = {
  createOrder: (paymentData, userId) => 
    api.post('/payments/create-order', paymentData, {
      headers: {
        'userId': userId
      }
    }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
  getPaymentsByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getUserPayments: (userId) => api.get(`/payments/user/${userId}`),
  getAllPayments: () => api.get('/payments/all'),
};

// Chatbot API
export const chatbotAPI = {
  askQuestion: (question) => api.post('/chatbot/ask', { question }),
  getAllFAQs: () => api.get('/chatbot/faqs'),
  getFAQsByCategory: (category) => api.get(`/chatbot/faqs/category/${category}`),
};