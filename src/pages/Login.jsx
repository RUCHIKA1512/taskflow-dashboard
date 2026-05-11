import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? '/api/users/login' : '/api/users/register';
      const { data } = await axios.post(`http://localhost:5000${url}`, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-secondary/20 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="text-white size-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight">TaskFlow</span>
        </div>

        <div className="bg-surface border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h1>
            <p className="text-zinc-500 text-sm">Please enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-background border border-zinc-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-background border border-zinc-800 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-zinc-800 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
