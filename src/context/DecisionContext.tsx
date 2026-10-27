import React, { createContext, useContext, useEffect, useState } from 'react';
import { Decision, Category, UserProfile } from '../types';
import { apiRequest } from '../utils/api';
import { INITIAL_USER } from '../utils/storage';

interface AuthResponse {
  user: UserProfile & { id: string };
  decisions: Decision[];
}

interface DecisionContextType {
  decisions: Decision[];
  currentDecision: Decision | null;
  setCurrentDecision: (decision: Decision | null) => void;
  searchDraft: string;
  setSearchDraft: (query: string) => void;
  categoryDraft: Category | null;
  setCategoryDraft: (cat: Category | null) => void;
  addDecision: (decision: Decision) => Promise<void>;
  toggleSaveDecision: (id: string) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;
  getDecisionById: (id: string) => Decision | undefined;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  deleteAllDecisions: () => Promise<boolean>;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  actionError: string | null;
  clearActionError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DecisionContext = createContext<DecisionContextType | undefined>(undefined);

export const DecisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState<Category | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const applySession = (result: AuthResponse) => {
    setUserProfileState(result.user);
    setDecisions(result.decisions);
    setCurrentDecision(result.decisions[0] || null);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    apiRequest<AuthResponse>('/auth/me')
      .then(applySession)
      .catch(() => {
        setIsLoggedIn(false);
        setDecisions([]);
        setCurrentDecision(null);
      })
      .finally(() => setIsAuthLoading(false));
    const expireSession = () => {
      setIsLoggedIn(false);
      setDecisions([]);
      setCurrentDecision(null);
      setUserProfileState(INITIAL_USER);
    };
    window.addEventListener('decidemate:session-expired', expireSession);
    return () => window.removeEventListener('decidemate:session-expired', expireSession);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    applySession(result);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password }),
    });
    applySession(result);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setDecisions([]);
    setCurrentDecision(null);
    setUserProfileState(INITIAL_USER);
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not reach the server to sign out.');
    }
  };

  const addDecision = async (decision: Decision) => {
    const result = await apiRequest<{ decision: Decision }>('/decisions', {
      method: 'POST', body: JSON.stringify(decision),
    });
    setDecisions((previous) => [result.decision, ...previous.filter((item) => item.id !== result.decision.id)]);
    setCurrentDecision(result.decision);
  };

  const toggleSaveDecision = async (id: string) => {
    const existing = decisions.find((decision) => decision.id === id);
    if (!existing) return;
    const updated = { ...existing, isSaved: !existing.isSaved };
    try {
      const result = await apiRequest<{ decision: Decision }>(`/decisions/${encodeURIComponent(id)}`, {
        method: 'PUT', body: JSON.stringify(updated),
      });
      setDecisions((previous) => previous.map((item) => item.id === id ? result.decision : item));
      setCurrentDecision((previous) => previous?.id === id ? result.decision : previous);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update this decision.');
    }
  };

  const deleteDecision = async (id: string) => {
    try {
      await apiRequest<void>(`/decisions/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const remaining = decisions.filter((decision) => decision.id !== id);
      setDecisions(remaining);
      if (currentDecision?.id === id) setCurrentDecision(remaining[0] || null);
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not delete this decision.');
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { email: _email, avatarText: _avatarText, ...serverUpdates } = updates;
      const result = await apiRequest<{ user: UserProfile }>('/auth/profile', {
        method: 'PATCH', body: JSON.stringify(serverUpdates),
      });
      setUserProfileState(result.user);
      setActionError(null);
      return true;
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update your profile.');
      return false;
    }
  };

  const deleteAllDecisions = async () => {
    try {
      await apiRequest<void>('/decisions', { method: 'DELETE' });
      setDecisions([]);
      setCurrentDecision(null);
      setActionError(null);
      return true;
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not clear your decisions.');
      return false;
    }
  };

  const getDecisionById = (id: string) => decisions.find((decision) => decision.id === id);

  return (
    <DecisionContext.Provider value={{
      decisions, currentDecision, setCurrentDecision, searchDraft, setSearchDraft,
      categoryDraft, setCategoryDraft, addDecision, toggleSaveDecision, deleteDecision,
      getDecisionById, userProfile, updateUserProfile, deleteAllDecisions, isLoggedIn,
      isAuthLoading, login, register, logout,
      actionError, clearActionError: () => setActionError(null),
    }}>
      {children}
    </DecisionContext.Provider>
  );
};

export const useDecisions = (): DecisionContextType => {
  const context = useContext(DecisionContext);
  if (!context) throw new Error('useDecisions must be used within a DecisionProvider');
  return context;
};
