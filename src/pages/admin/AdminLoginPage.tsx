import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Lock, Mail } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@vastramay.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        showToast('Authenticated successfully as Atelier Super Admin.', 'success');
        navigate('/admin/dashboard');
      } else {
        showToast(res.error || 'Invalid credentials.', 'error');
      }
    } catch (err) {
      showToast('Authentication error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@vastramay.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-brand-espresso flex flex-col justify-center items-center px-4 py-12 text-white">
      <div className="w-full max-w-md bg-[#2A1815] border border-brand-gold/30 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold mx-auto flex items-center justify-center text-brand-gold shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase">
            Vastramay Atelier Ops
          </h1>
          <p className="text-xs text-brand-gold font-medium">Internal Administration & Order Fulfillment</p>
        </div>

        {/* Demo Fast Fill Card */}
        <div className="p-3.5 bg-brand-espresso border border-brand-gold/40 rounded-xl text-xs space-y-2">
          <div className="flex items-center justify-between text-brand-gold">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              Demo Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] bg-brand-gold text-brand-espresso font-bold px-2 py-0.5 rounded hover:bg-[#A88A58] transition-colors"
            >
              One-Click Fill
            </button>
          </div>
          <p className="text-[11px] text-white/70">
            Email: <strong className="text-white">admin@vastramay.com</strong> · Pass: <strong className="text-white">admin123</strong>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Staff Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-brand-gold" />}
            required
          />
          <Input
            label="Security Passkey"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-brand-gold" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Access Admin Console
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
