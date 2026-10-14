import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HomepageNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address (e.g. name@domain.com).');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-brand-espresso text-brand-ivory border border-brand-gold/30 shadow-2xl p-8 sm:p-14 md:p-16 text-center max-w-4xl mx-auto">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Atelier Private Circle</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ivory leading-[1.15]">
            Join The Vastramay Circle{' '}
            <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
              Privileged Access
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-brand-ivory/80 max-w-xl mx-auto font-light leading-relaxed">
            Receive private preview invitations to new festive drops, styling masterclasses by royal bespoke drapers, and complimentary bespoke alteration consultation on your inaugural order.
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="p-6 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 text-brand-gold max-w-md mx-auto space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 mx-auto text-brand-gold" />
              <h3 className="font-serif text-xl font-medium text-brand-ivory">
                Welcome to the Atelier Circle
              </h3>
              <p className="text-xs text-brand-ivory/80">
                A welcome dossier with your styling privileges has been dispatched to your inbox.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs uppercase tracking-wider font-semibold text-brand-gold underline underline-offset-4 pt-2"
              >
                Register another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ivory/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email for private access..."
                    className="w-full bg-black/40 border border-brand-gold/30 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-ivory placeholder-brand-ivory/40 focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={status === 'loading'}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-brand-gold hover:bg-brand-gold-600 text-brand-espresso font-semibold shadow-gold shrink-0 py-3"
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                </Button>
              </div>

              {status === 'error' && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-[10px] text-brand-ivory/50">
                We respect your sanctuary. No spam, only rare festive editions. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
