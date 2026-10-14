import React, { useState } from 'react';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';

export const PincodeLookup: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    city?: string;
    deliveryDate?: string;
    message?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setResult({
        valid: false,
        message: 'Please enter a valid 6-digit Indian postal pincode.',
      });
      return;
    }

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      // Realistic delivery calculation: 3 business days from now
      const deliverBy = new Date();
      deliverBy.setDate(deliverBy.getDate() + 3);
      const formattedDate = new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(deliverBy);

      setResult({
        valid: true,
        deliveryDate: formattedDate,
        message: `Express Dispatch Available · Estimated delivery by ${formattedDate} via BlueDart / Delhivery Priority.`,
      });
    }, 350);
  };

  return (
    <div className="p-4 rounded-2xl bg-brand-ivory-100/60 border border-brand-espresso/10 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-espresso uppercase tracking-wider">
        <Truck className="w-4 h-4 text-brand-gold-600" />
        <span>Check Doorstep Delivery & COD</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            if (result) setResult(null);
          }}
          placeholder="Enter 6-digit pincode (e.g. 400001)"
          className="flex-1 bg-white border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso placeholder-brand-ink/40 focus:outline-hidden focus:border-brand-gold"
        />
        <button
          type="submit"
          disabled={checking || pincode.length < 6}
          className="px-4 py-2 rounded-lg bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors shrink-0 shadow-2xs"
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && (
        <div
          className={`flex items-start gap-2 pt-1 text-xs animate-fadeIn ${
            result.valid ? 'text-emerald-800' : 'text-rose-700'
          }`}
        >
          {result.valid ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span className="leading-relaxed">{result.message}</span>
        </div>
      )}
    </div>
  );
};
