export type Category = 'Education' | 'Career' | 'Finance' | 'Shopping' | 'Lifestyle' | 'Other';

export type Priority = 'Best Value' | 'Highest Quality' | 'Lowest Price' | 'Speed & Ease' | 'Long-term Impact';

export interface DecisionOption {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  rating?: number;
  reviewsCount?: number;
  badge?: string; // e.g. "Best Choice", "Runner Up", "Budget Pick"
  specs: string[];
  isRecommended?: boolean;
  pros?: string[];
  cons?: string[];
}

export interface ComparisonRow {
  attribute: string;
  recommended: string;
  alt1: string;
  alt2: string;
}

export interface Decision {
  id: string;
  recommendationSource?: 'gemini' | 'local';
  question: string;
  category: Category;
  priority: Priority;
  preferences: string[];
  additionalDetails?: string;
  createdAt: string; // ISO date string or formatted date
  suitabilityScore: number; // e.g. 8.8
  suitabilitySummary: string;
  recommendedOption: DecisionOption;
  alternatives: DecisionOption[];
  pros: string[];
  cons: string[];
  whyRecommended: string;
  comparison: ComparisonRow[];
  isSaved: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarText: string;
  defaultCategory: Category;
  language: string;
  emailNotifications: boolean;
  theme: 'dark' | 'light';
}
