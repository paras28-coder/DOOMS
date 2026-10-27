import { Decision } from '../types';
import { apiRequest } from './api';
import { RecommendationParams } from './recommendation';

export async function requestRecommendation(params: RecommendationParams): Promise<Decision> {
  const result = await apiRequest<{ decision: Decision; source: 'gemini' | 'local' }>('/recommendations', {
    method: 'POST', body: JSON.stringify(params),
  });
  return result.decision;
}
