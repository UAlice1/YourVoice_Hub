import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Components/Home/HomePage';
import NgoDashboard from './Pages/ngo/NgoDashboard';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage />} />
              
              <Route path="/Register" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* NGO dashboard */}
  <Route
    path="/ngo"
    element={
      <ProtectedRoute allowedRoles={['ngo']}>
        <NgoDashboard />
      </ProtectedRoute>
    }
  />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;