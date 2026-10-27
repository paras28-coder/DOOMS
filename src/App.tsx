/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DecisionProvider } from './context/DecisionContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { useDecisions } from './context/DecisionContext';
import { useTheme } from './context/ThemeContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, isAuthLoading } = useDecisions();
  if (isAuthLoading) return <div className="py-16 text-center text-sm text-slate-400">Loading your account…</div>;
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const ActionErrorBanner: React.FC = () => {
  const { actionError, clearActionError } = useDecisions();
  if (!actionError) return null;
  return (
    <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
      <span>{actionError}</span>
      <button type="button" onClick={clearActionError} aria-label="Dismiss error">×</button>
    </div>
  );
};

const SyncAccountTheme: React.FC = () => {
  const { isLoggedIn, userProfile } = useDecisions();
  const { setTheme } = useTheme();
  useEffect(() => {
    if (isLoggedIn) setTheme(userProfile.theme);
  }, [isLoggedIn, userProfile.theme, setTheme]);
  return null;
};

// Pages
import { Dashboard } from './pages/Dashboard';
import { DecisionForm } from './pages/DecisionForm';
import { AIResults } from './pages/AIResults';
import { History } from './pages/History';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Settings } from './pages/Settings';
import { ResetPassword } from './pages/ResetPassword';

export default function App() {
  return (
    <ThemeProvider>
      <DecisionProvider>
        <SyncAccountTheme />
        <BrowserRouter>
          <div className="flex h-screen w-screen overflow-hidden bg-[#070B14] dark:bg-[#070B14] light:bg-[#F4F7FC] text-white dark:text-white light:text-slate-900 transition-colors duration-300">
            {/* Desktop Left Sidebar */}
            <div className="hidden md:block h-full shrink-0">
              <Sidebar />
            </div>

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
              {/* Top Navigation */}
              <Navbar />

              {/* Scrollable Page Content */}
              <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 pb-20 md:pb-8">
                <div className="max-w-6xl mx-auto">
                  <ActionErrorBanner />
                  <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/new-decision" element={<ProtectedRoute><DecisionForm /></ProtectedRoute>} />
                    <Route path="/results" element={<ProtectedRoute><AIResults /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                    <Route path="/saved" element={<ProtectedRoute><History /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>

              {/* Mobile Bottom Navigation */}
              <MobileNav />
            </div>
          </div>
        </BrowserRouter>
      </DecisionProvider>
    </ThemeProvider>
  );
}
