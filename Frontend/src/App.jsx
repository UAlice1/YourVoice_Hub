import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './Pages/Authpage';
import Dashboard from './Pages/Dashboard';
import SubmitCase from './Pages/SubmitCase/SubmitCase';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Components/Home/HomePage';
import NgoDashboard from './Pages/ngo/NgoDashboard';
import AiSupportChat from "./Pages/AiSupportChat";
import Cases from "./Pages/Cases";


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
              <Route path="/cases"
               element={
               <ProtectedRoute>
                <Cases/>
                </ProtectedRoute>
                } 
              />
              <Route path="/submit-case" element={<SubmitCase />} />
              <Route path="/AiSupportChat" element={<AiSupportChat />} />
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