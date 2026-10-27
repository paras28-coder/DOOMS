import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { DecideMateLogo } from '../components/DecideMateLogo';
import { useDecisions } from '../context/DecisionContext';
import { apiRequest } from '../utils/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useDecisions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModal, setForgotModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');
    setResetUrl('');
    try {
      const result = await apiRequest<{ message: string; developmentResetUrl?: string }>('/auth/forgot-password', {
        method: 'POST', body: JSON.stringify({ email }),
      });
      setResetMessage(result.message);
      setResetUrl(result.developmentResetUrl || '');
    } catch (err) {
      setResetMessage(err instanceof Error ? err.message : 'Could not request a reset link.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-7 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow behind card */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#1677FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#00D9FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <DecideMateLogo size="lg" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mt-2">
            Welcome Back!
          </h2>
          <p className="text-xs text-slate-400">
            Log in to continue your smart decision journey.
          </p>
        </div>

        {(location.state as { message?: string } | null)?.message && (
          <div role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            {(location.state as { message: string }).message}
          </div>
        )}

        {/* Account security note */}
        <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5 text-xs text-blue-300">
          <Sparkles className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold text-[#00D9FF]">Secure Account Sign-In: </span>
            Enter the email and password you used when you created your account.
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white dark:text-white light:text-slate-800">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white dark:text-white light:text-slate-800">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Your password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password help */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Your session uses a secure browser cookie.</span>

            <button
              type="button"
              onClick={() => setForgotModal(true)}
              className="text-[#00D9FF] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1677FF] hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(22,119,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#1677FF] hover:text-[#00D9FF] font-bold">
            Sign up
          </Link>
        </p>

        {/* Password reset dialog */}
        {forgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <form onSubmit={handleForgotSubmit} className="max-w-sm w-full bg-[#101A2D] border border-[#1F2E4D] rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white">Reset your password</h4>
              <p className="text-xs text-slate-400">We’ll send a one-time link if an account exists for this email.</p>
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="w-full p-2.5 rounded-xl bg-[#091120] border border-[#1F2E4D] text-white text-sm" />
              {resetMessage && <p className="text-xs text-slate-300">{resetMessage}</p>}
              {resetUrl && <a href={resetUrl} className="block break-all text-xs text-cyan-300 underline">Open development reset link</a>}
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2 bg-[#1677FF] disabled:opacity-60 text-white text-xs font-bold rounded-xl"
              >
                {resetLoading ? 'Sending…' : 'Send reset link'}
              </button>
              <button type="button" onClick={() => setForgotModal(false)} className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-xl">Close</button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
