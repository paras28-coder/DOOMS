export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('X-Requested-With', 'DecideMate');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers,
      credentials: 'same-origin',
    });
  } catch {
    throw new ApiError('Could not reach the DecideMate server. Check that it is running and try again.', 0);
  }

  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  const publicAuthPaths = ['/auth/login', '/auth/register', '/auth/me', '/auth/forgot-password', '/auth/reset-password'];
  if (response.status === 401 && !publicAuthPaths.some((publicPath) => path.startsWith(publicPath))) {
    window.dispatchEvent(new Event('decidemate:session-expired'));
  }
  if (!response.ok) throw new ApiError(payload.error || 'The request could not be completed.', response.status);
  return payload;
}
