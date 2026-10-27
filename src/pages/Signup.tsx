import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
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

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useDecisions();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account. Please try again.');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-7 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <DecideMateLogo size="lg" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mt-2">
            Create an Account
          </h2>
          <p className="text-xs text-slate-400">
            Create an account to keep your decisions private and available when you sign in.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white dark:text-white light:text-slate-800">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paras"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]"
              />
            </div>
          </div>

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
                placeholder="paras@example.com"
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
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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

          {/* Agree checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-slate-700 text-[#1677FF] mt-0.5"
              />
              <span>
                I agree to the Terms of Service and Privacy Policy for DecideMate AI.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1677FF] hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(22,119,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1677FF] hover:text-[#00D9FF] font-bold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
