'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Package, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN';
  orders?: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalLkr: string;
    createdAt: string;
  }[];
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Authentication failed');
      return;
    }
    if (data.user?.role === 'ADMIN') {
      router.push('/admin');
      return;
    }
    fetchProfile();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) {
    return <div className="max-w-lg mx-auto py-24 text-center text-sm text-sage">Loading account...</div>;
  }

  if (user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-ivory-light p-6 sm:p-8 rounded-3xl border border-sage/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest text-gold flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-forest">{user.fullName}</h1>
              <p className="text-xs text-botanicalText/70">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-gold text-forest px-4 py-2.5 rounded-full text-xs font-bold"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-sage/30 px-4 py-2.5 rounded-full text-xs font-semibold text-botanicalText hover:bg-sage/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-forest flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order History
          </h2>

          {user.orders && user.orders.length > 0 ? (
            <div className="space-y-3">
              {user.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-ivory-light p-5 rounded-2xl border border-sage/20 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <p className="font-bold text-forest text-sm">{ord.orderNumber}</p>
                    <p className="text-botanicalText/70">
                      {new Date(ord.createdAt).toLocaleDateString('en-LK')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-sage-soft text-forest font-semibold">
                      {ord.status}
                    </span>
                    <span className="font-bold text-forest">
                      LKR {Number(ord.totalLkr).toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-botanicalText/70 bg-ivory-light p-6 rounded-2xl border border-sage/20">
              No orders linked to this account yet.
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-ivory-light p-8 rounded-3xl border border-sage/25 shadow-botanical space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold text-forest">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-botanicalText/75 mt-1">
            Track orders, save delivery addresses, and manage your wishlist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-white border border-sage/30 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white border border-sage/30 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white border border-sage/30 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          {error && <p className="text-xs text-terracotta font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-forest text-ivory py-3.5 rounded-full text-sm font-semibold hover:bg-forest-dark transition"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-forest font-semibold hover:underline"
          >
            {mode === 'login'
              ? "Don't have an account? Register here"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </main>
  );
}
