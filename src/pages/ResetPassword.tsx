import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, Lock } from 'lucide-react';
import { DecideMateLogo } from '../components/DecideMateLogo';
import { apiRequest } from '../utils/api';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!token) return setError('This reset link is missing its token. Request a new link.');
    if (password !== confirmPassword) return setError('The passwords do not match.');
    setIsSubmitting(true);
    try {
      await apiRequest<{ message: string }>('/auth/reset-password', {
        method: 'POST', body: JSON.stringify({ token, password }),
      });
      navigate('/login', { replace: true, state: { message: 'Password updated. Sign in with your new password.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset your password. Request a new link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-10 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-7 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <DecideMateLogo size="lg" />
          <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900">Choose a new password</h1>
          <p className="text-sm text-slate-400">Reset links expire after one hour and can only be used once.</p>
        </div>
        {error && <div role="alert" className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-bold text-slate-300" htmlFor="new-password">New password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091120] border border-[#1F2E4D] text-white text-sm" />
          </div>
          <label className="block text-xs font-bold text-slate-300" htmlFor="confirm-password">Confirm new password</label>
          <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter password" className="w-full p-3 rounded-xl bg-[#091120] border border-[#1F2E4D] text-white text-sm" />
          <button disabled={isSubmitting} className="w-full py-3 rounded-xl bg-[#1677FF] disabled:opacity-60 text-white font-bold text-sm">{isSubmitting ? 'Updating…' : 'Reset Password'}</button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400"><Link to="/login" className="text-cyan-300 hover:underline">Return to sign in</Link></p>
      </motion.div>
    </div>
  );
};
