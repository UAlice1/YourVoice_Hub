import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    location: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
    setValidationErrors({});
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError('');
    setValidationErrors({});
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Email is invalid';
    if (!loginData.password) errors.password = 'Password is required';
    return errors;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.name.trim()) errors.name = 'Name is required';
    if (!registerData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) errors.email = 'Email is invalid';
    if (!registerData.password) errors.password = 'Password is required';
    else if (registerData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(loginData.email, loginData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateRegister();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    const { confirmPassword, ...dataToSend } = registerData;
    if (!dataToSend.phone) delete dataToSend.phone;
    if (!dataToSend.location) delete dataToSend.location;

    const result = await register(dataToSend);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white border-2 border-teal-400 rounded-2xl shadow-xl p-8">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-teal-100 text-teal-600 text-2xl mb-3">
          ♡
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to YourVoice Hub
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          A safe space for support and guidance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => {
            setActiveTab('login');
            setError('');
            setValidationErrors({});
          }}
          className={`w-1/2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'login'
              ? 'bg-white shadow text-gray-800'
              : 'text-gray-500'
          }`}
        >
          Login
        </button>

        <button
          onClick={() => {
            setActiveTab('register');
            setError('');
            setValidationErrors({});
          }}
          className={`w-1/2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'register'
              ? 'bg-white shadow text-gray-800'
              : 'text-gray-500'
          }`}
        >
          Register
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="name@example.com"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                validationErrors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                validationErrors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl font-medium transition duration-200 shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={registerData.name}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <select
            name="role"
            value={registerData.role}
            onChange={handleRegisterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="user">Individual seeking support</option>
            <option value="ngo">NGO / Organization</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl font-medium transition duration-200 shadow-md"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
        <br />
        Your data is encrypted and secure.
      </p>
    </div>
  </div>
);
};

export default AuthPage;