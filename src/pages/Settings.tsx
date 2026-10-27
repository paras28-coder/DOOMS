import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Moon,
  Sun,
  Globe,
  Sliders,
  Bell,
  Trash2,
  LogOut,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDecisions } from '../context/DecisionContext';
import { Category } from '../types';
import { apiRequest } from '../utils/api';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    userProfile,
    updateUserProfile,
    deleteAllDecisions,
    isLoggedIn,
    logout,
    decisions,
  } = useDecisions();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [defaultCategory, setDefaultCategory] = useState<Category>(userProfile.defaultCategory);
  const [language, setLanguage] = useState(userProfile.language);
  const [emailNotifications, setEmailNotifications] = useState(userProfile.emailNotifications);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const saved = await updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      defaultCategory,
      language,
      emailNotifications,
      avatarText: name.charAt(0).toUpperCase() || 'P',
    });
    setSaveSuccess(saved);
    if (saved) setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleConfirmClear = async () => {
    if (await deleteAllDecisions()) setClearModal(false);
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    try {
      const result = await apiRequest<{ message: string }>('/auth/change-password', {
        method: 'POST', body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordMessage(result.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Could not update the password.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Customize your experience, default preferences, and account controls.
        </p>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs sm:text-sm text-emerald-400 flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences updated successfully!</span>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-6 sm:p-7 shadow-lg space-y-5">
        <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-[#00D9FF]" />
          <span>Profile Information</span>
        </h3>

        <div className="flex items-center gap-4 pb-4 border-b border-[#1F2E4D]/60 light:border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1677FF] to-[#00D9FF] flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(0,217,255,0.3)]">
            {userProfile.avatarText || 'P'}
          </div>
          <div>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900">
              {userProfile.name}
            </h4>
            <p className="text-xs text-slate-400">{userProfile.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/25">
              Active Member
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Section matching Screen 6 */}
      <div className="rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-6 sm:p-7 shadow-lg space-y-5">
        <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00D9FF]" />
          <span>App Preferences</span>
        </h3>

        <div className="space-y-4">
          {/* Default Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2E4D]/60 light:border-slate-200">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white dark:text-white light:text-slate-900">
                Default Category
              </h4>
              <p className="text-xs text-slate-400">
                Pre-selects this category when opening the decision form
              </p>
            </div>
            <select
              value={defaultCategory}
              onChange={(e) => {
                const newCat = e.target.value as Category;
                setDefaultCategory(newCat);
                updateUserProfile({ defaultCategory: newCat });
              }}
              className="p-2 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF] cursor-pointer"
            >
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Education">🎓 Education</option>
              <option value="Career">💼 Career</option>
              <option value="Finance">📈 Finance</option>
              <option value="Lifestyle">✨ Lifestyle</option>
              <option value="Other">🧭 Other</option>
            </select>
          </div>

          {/* Language selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2E4D]/60 light:border-slate-200">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white dark:text-white light:text-slate-900">
                Language
              </h4>
              <p className="text-xs text-slate-400">
                Interface and decision comparison language
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                updateUserProfile({ language: e.target.value });
              }}
              className="p-2 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF] cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
              <option value="Japanese">日本語 (Japanese)</option>
            </select>
          </div>

          {/* Theme switch matching Screen 6 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2E4D]/60 light:border-slate-200">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white dark:text-white light:text-slate-900">
                Interface Theme
              </h4>
              <p className="text-xs text-slate-400">
                Toggle between deep futuristic dark mode and clean light mode
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'dark'}
                  onChange={() => {
                    setTheme('dark');
                    void updateUserProfile({ theme: 'dark' });
                  }}
                  className="text-[#1677FF]"
                />
                <Moon className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Dark Mode</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'light'}
                  onChange={() => {
                    setTheme('light');
                    void updateUserProfile({ theme: 'light' });
                  }}
                  className="text-[#1677FF]"
                />
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Mode</span>
              </label>
            </div>
          </div>

          {/* Email Notifications toggle switch matching Screen 6 */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white dark:text-white light:text-slate-900">
                Email Notifications
              </h4>
              <p className="text-xs text-slate-400">
                Receive summaries when you save major decisions
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !emailNotifications;
                setEmailNotifications(nextVal);
                updateUserProfile({ emailNotifications: nextVal });
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                emailNotifications ? 'bg-[#1677FF]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account & Data Management matching Screen 6 */}
      <div className="rounded-3xl bg-[#101A2D] dark:bg-[#101A2D] light:bg-white border border-[#1F2E4D] light:border-slate-200 p-6 sm:p-7 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#00D9FF]" />
          <span>Account & Storage</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Change Password modal trigger */}
          <button
            type="button"
            onClick={() => setPasswordModal(true)}
            className="p-3.5 rounded-xl bg-[#091120] dark:bg-[#091120] light:bg-slate-50 border border-[#1F2E4D] light:border-slate-200 hover:border-slate-500 text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                Change Password
              </div>
              <div className="text-[11px] text-slate-400">Update your security credentials</div>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </button>

          {/* Delete all account decisions */}
          <button
            type="button"
            onClick={() => setClearModal(true)}
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-rose-400">Delete All Decisions</div>
              <div className="text-[11px] text-rose-300/70">Permanently remove this account’s decision history</div>
            </div>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-slate-200">
                {isLoggedIn ? 'Log Out' : 'Sign In'}
              </div>
              <div className="text-[11px] text-slate-400">End current session</div>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {clearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full rounded-2xl bg-[#101A2D] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-white">Clear Decision History?</h4>
              <p className="text-xs text-slate-400">
              This will permanently remove all {decisions.length} decisions saved to your account.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClearModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change password */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleChangePassword} className="max-w-sm w-full rounded-2xl bg-[#101A2D] border border-[#1F2E4D] p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Change Password</h4>
            <input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" className="w-full p-2.5 rounded-xl bg-[#091120] border border-[#1F2E4D] text-white text-sm" />
            <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password (at least 8 characters)" className="w-full p-2.5 rounded-xl bg-[#091120] border border-[#1F2E4D] text-white text-sm" />
            {passwordError && <p role="alert" className="text-xs text-rose-300">{passwordError}</p>}
            {passwordMessage && <p role="status" className="text-xs text-emerald-300">{passwordMessage}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPasswordModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button type="submit" className="flex-1 py-2 rounded-xl bg-[#1677FF] text-white text-xs font-bold">Update Password</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
