import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Mail, Lock, Phone, User, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { isValidIndianPhone } from '../../utils/addressValidation';

/**
 * Customer Login Page
 */
export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('aarav.singhania@example.com');
  const [password, setPassword] = useState('RoyalVastra2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await loginCustomer(email);
      showToast('Welcome back to the Vastramay Atelier.', 'success');
      navigate(returnUrl);
    } catch (err) {
      showToast('Login failed. Please check credentials or try demo auto-fill.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('aarav.singhania@example.com');
    setPassword('RoyalVastra2026');
    setErrors({});
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FAF7F2] to-white">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-espresso/10 p-8 shadow-xl space-y-6">
        {/* Brand Monogram */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-brand-espresso border-2 border-brand-gold mx-auto flex items-center justify-center text-brand-gold shadow-md">
            <Crown className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">Sign In to Vastramay</h1>
          <p className="text-xs text-brand-espresso/60">
            Access your curated bespoke measurements, wishlist, and royal orders
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-3.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-espresso">
            <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
            <div>
              <p className="font-bold">Simulated Patron Account</p>
              <p className="text-[11px] text-brand-espresso/70">Click to fill pre-configured test credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3 py-1 bg-brand-gold text-brand-espresso text-xs font-bold rounded-lg hover:bg-[#A88A58] transition-colors"
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="e.g. patron@vastramay.com"
              leftIcon={<Mail className="w-4 h-4 text-brand-espresso/40" />}
              error={errors.email}
              required
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-brand-espresso/40" />}
              error={errors.password}
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-brand-espresso/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>Remember this device</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-brand-terracotta hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Atelier
          </Button>
        </form>

        {/* Security & Disclaimer Notice */}
        <div className="p-3 bg-brand-ivory/60 rounded-lg border border-brand-espresso/5 text-[11px] text-brand-espresso/60 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
          <span>
            <strong>Demo Architecture Notice:</strong> Customer authentication is simulated locally. No plaintext credentials are stored on remote servers.
          </span>
        </div>

        <div className="text-center text-xs text-brand-espresso/70 pt-2 border-t border-brand-espresso/10 space-y-2">
          <p>
            New to Vastramay?{' '}
            <Link to="/register" className="text-brand-gold font-bold hover:underline">
              Create an Atelier Account
            </Link>
          </p>
          <p className="text-[11px]">
            Are you a team member?{' '}
            <Link to="/admin/login" className="text-brand-espresso font-semibold hover:underline">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Customer Registration Page
 */
export const CustomerRegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim() || firstName.length < 2) {
      errs.firstName = 'First name must be at least 2 characters';
    }
    if (!lastName.trim()) {
      errs.lastName = 'Last name is required';
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!phone || !isValidIndianPhone(phone)) {
      errs.phone = 'Valid 10-digit Indian phone is required';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!acceptTerms) {
      errs.terms = 'You must accept the terms and privacy policy';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Simulate account registration
      await new Promise((r) => setTimeout(r, 600));
      await loginCustomer(email);
      showToast(`Welcome to the Vastramay family, ${firstName}!`, 'success');
      navigate('/account');
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FAF7F2] to-white">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-brand-espresso/10 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-brand-espresso border-2 border-brand-gold mx-auto flex items-center justify-center text-brand-gold shadow-md">
            <Crown className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">Create an Atelier Account</h1>
          <p className="text-xs text-brand-espresso/60">
            Join the Vastramay Circle for bespoke fittings, bridal styling, and festive previews
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Ananya"
              leftIcon={<User className="w-4 h-4 text-brand-espresso/40" />}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              error={errors.lastName}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ananya.sharma@example.com"
            leftIcon={<Mail className="w-4 h-4 text-brand-espresso/40" />}
            error={errors.email}
            required
          />

          <Input
            label="Mobile Phone (+91)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98201 44521"
            leftIcon={<Phone className="w-4 h-4 text-brand-espresso/40" />}
            error={errors.phone}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-brand-espresso/40" />}
              error={errors.password}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-brand-espresso/80">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
              />
              <span>
                I accept the Vastramay{' '}
                <Link to="/privacy" className="text-brand-gold font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-gold font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && <p className="text-xs text-brand-terracotta">{errors.terms}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create My Account
          </Button>
        </form>

        <div className="text-center text-xs text-brand-espresso/70 pt-2 border-t border-brand-espresso/10">
          Already a patron?{' '}
          <Link to="/login" className="text-brand-gold font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Customer Forgot Password / Account Recovery Page
 */
export const CustomerForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('aarav.singhania@example.com');
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [otp, setOtp] = useState('202688');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setStep('verify');
    showToast('Simulated 6-digit verification code dispatched.', 'info');
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setStep('success');
    showToast('Your atelier password has been reset successfully.', 'success');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FAF7F2] to-white">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-espresso/10 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-brand-espresso border-2 border-brand-gold mx-auto flex items-center justify-center text-brand-gold shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">Account Recovery</h1>
          <p className="text-xs text-brand-espresso/60">
            {step === 'request'
              ? 'Enter your registered email address to receive an atelier reset code'
              : step === 'verify'
              ? 'Enter the 6-digit verification code and your new password'
              : 'Password updated successfully'}
          </p>
        </div>

        {step === 'request' && (
          <form onSubmit={handleSendReset} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patron@vastramay.com"
              leftIcon={<Mail className="w-4 h-4 text-brand-espresso/40" />}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg text-xs flex items-center gap-2 text-brand-espresso">
              <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Demo OTP simulation: <strong>202688</strong></span>
            </div>

            <Input
              label="6-Digit Verification Code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="202688"
              required
            />

            <Input
              label="New Atelier Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-brand-espresso/40" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-brand-espresso/80">
              Your password has been securely updated. You can now sign in with your new credentials.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Return to Sign In
            </Button>
          </div>
        )}

        <div className="text-center pt-2 border-t border-brand-espresso/10">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-brand-espresso/70 hover:text-brand-espresso font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
