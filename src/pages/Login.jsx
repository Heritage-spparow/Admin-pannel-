import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        
        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your application
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-lg shadow-sm border p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Optional future links */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Secure admin access</span>
            <span className="text-gray-400 cursor-not-allowed">
              Forgot password?
            </span>
          </div>

          <button
            disabled={loading}
            className={`w-full rounded-md py-2.5 text-sm font-medium text-white transition
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}
            `}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
