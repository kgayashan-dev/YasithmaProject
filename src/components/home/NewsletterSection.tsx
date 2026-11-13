'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setMessage('Please agree to receive botanical updates.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      setStatus('success');
      setMessage('Thank you for joining the Yasithma Botanical Circle.');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Unable to subscribe right now.');
    }
  };

  return (
    <section className="py-16 bg-sage-soft/50 border-t border-sage/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-forest text-gold flex items-center justify-center mx-auto">
          <Mail className="w-5 h-5" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-forest">
          Join Our Botanical Circle
        </h2>
        <p className="text-sm text-botanicalText/80 max-w-lg mx-auto">
          Receive seasonal Ceylon herbal harvest notes, brewing guides, and new product
          announcements. Unsubscribe anytime with one click.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-2 bg-forest text-ivory px-6 py-3 rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-ivory-light border border-sage/30 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-forest"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-forest text-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-forest-dark transition"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            <label className="flex items-center justify-center gap-2 text-xs text-botanicalText/75 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="rounded border-sage text-forest focus:ring-forest"
              />
              <span>I consent to receive emails from Yasithma Products.</span>
            </label>
            {status === 'error' && (
              <p className="text-xs text-terracotta font-medium">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
