import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import SubmitCase from './Pages/SubmitCase/SubmitCase';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Components/Home/HomePage';
import NgoDashboard from './Pages/ngo/NgoDashboard';
import NGOCaseDetails from './Pages/ngo/NgoCaseDetails';
import AiSupportChat from "./Pages/AiSupportChat";
import Cases from './Pages/Cases';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ── AI Support Chat — no navbar or footer ── */}
          <Route path="/AiSupportChat" element={<AiSupportChat />} />

          {/* ── All other pages — with navbar and footer ── */}
          <Route
            path="*"
            element={
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

                    <Route
                      path="/cases"
                      element={
                        <ProtectedRoute>
                          <Cases />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/submit-case" element={<SubmitCase />} />

                    <Route path="/ngo/cases/:uuid" element={<NGOCaseDetails />} />

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
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;