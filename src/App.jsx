
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { PollProvider } from '@/contexts/PollContext';
import HomePage from '@/pages/HomePage';
import AdminDashboard from '@/pages/AdminDashboard';
import AudiencePage from '@/pages/AudiencePage';
import PollSession from '@/pages/PollSession';
import AdminLogin from '@/pages/AdminLogin';
import AdminProfile from '@/pages/AdminProfile';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import ThemeProvider from '@/contexts/ThemeContext'; 
import ThemeToggle from '@/components/ui/ThemeToggle';

const AdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAuth();
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <PollProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
             <Route 
              path="/admin/profile" 
              element={
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              } 
            />
            <Route path="/audience" element={<AudiencePage />} />
            <Route 
              path="/session/:sessionCode" 
              element={
                  <PollSession />
              } 
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </PollProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
