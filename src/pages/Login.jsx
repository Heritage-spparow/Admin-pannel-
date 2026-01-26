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
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, otp || undefined);
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md p-6 rounded shadow space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div>
          <label className="text-sm block mb-1">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full border rounded px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm block mb-1">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="w-full border rounded px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm block mb-1">2FA (optional)</label>
          <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter OTP if required" className="w-full border rounded px-3 py-2"/>
        </div>
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded hover:opacity-90">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
