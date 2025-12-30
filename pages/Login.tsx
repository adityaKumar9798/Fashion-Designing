
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../firebase';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    authService.getCurrentUser().then(user => {
      if (user) {
        if (user.role === UserRole.ADMIN) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    });
  }, [navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-sm border border-zinc-100">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Welcome Back</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-[10px] tracking-widest uppercase mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900 transition-all text-zinc-900 bg-transparent placeholder-zinc-200"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900 transition-all text-zinc-900 bg-transparent placeholder-zinc-200"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-zinc-900 text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-zinc-100">
          <p className="text-zinc-500 text-xs mb-4">Don't have an account?</p>
          <Link to="/signup" className="text-xs font-bold tracking-widest uppercase text-zinc-900 border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
