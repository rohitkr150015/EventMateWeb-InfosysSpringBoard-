import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Homepage */}
                <Route path="/" element={<Homepage />} />

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* User Dashboard */}
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
