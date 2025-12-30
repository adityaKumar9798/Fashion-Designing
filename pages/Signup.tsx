
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../firebase';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    authService.getCurrentUser().then(user => {
      if (user) {
        navigate('/');
      }
    });
  }, [navigate]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (name.length < 2) {
      setError('Name must be at least 2 characters long');
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.signup(name, email, password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white p-12 shadow-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Create Account</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Join the Yashvi Studio world</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-[10px] tracking-widest uppercase mb-8 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 text-[10px] tracking-widest uppercase mb-8 border border-green-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Full Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900 transition-all text-zinc-900 bg-transparent placeholder-zinc-200"
              placeholder="Jane Doe"
            />
          </div>
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
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Confirm Password</label>
            <input 
              required
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border-b border-zinc-200 py-3 outline-none focus:border-zinc-900 transition-all text-zinc-900 bg-transparent placeholder-zinc-200"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-zinc-900 text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-zinc-100">
          <p className="text-zinc-500 text-xs mb-4">Already have an account?</p>
          <Link to="/login" className="text-xs font-bold tracking-widest uppercase text-zinc-900 border-b border-zinc-900 pb-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
