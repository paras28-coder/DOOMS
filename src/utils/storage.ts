import { UserProfile } from '../types';

const THEME_KEY = 'decidemate_theme';

export const INITIAL_USER: UserProfile = {
  name: '',
  email: '',
  avatarText: '?',
  defaultCategory: 'Shopping',
  language: 'English',
  emailNotifications: true,
  theme: 'dark',
};

export const getStoredTheme = (): 'dark' | 'light' => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'light' || theme === 'dark' ? theme : 'dark';
  } catch {
    return 'dark';
  }
};

export const saveThemeToStorage = (theme: 'dark' | 'light'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference', error);
  }
};
