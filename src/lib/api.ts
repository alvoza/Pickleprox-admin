import { getAuthToken } from './auth';
import {
  getMockDashboard,
  getMockTournaments,
  getMockTips,
  type ApiResponse,
} from './mock-data';
import type { Court, Game, Tournament, User, Tip, DashboardStats } from '@/types/models';

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { data: null, error: 'Not authenticated' };
    }

    const url = `${API_BASE}/v1${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        return { data: null, error: errorData.error || errorData.message || `Request failed: ${response.status}` };
      } catch {
        return { data: null, error: `Request failed: ${response.status}` };
      }
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  // ==========================================================================
  // REAL ENDPOINTS (already exist in backend)
  // ==========================================================================

  getCurrentUser: () => request<User>('/users/me'),

  getCourts: () => request<{ courts: Court[] }>('/courts'),

  getGames: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return request<{ games: Game[] }>(`/games${params}`);
  },

  getTournaments: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return request<{ tournaments: Tournament[] }>(`/tournaments${params}`);
  },

  // ==========================================================================
  // ADMIN ENDPOINTS (mock for now — swap when backend is built)
  // ==========================================================================

  admin: {
    // TODO: Replace with: return request<DashboardStats>('/admin/analytics/dashboard')
    getDashboard: (): Promise<ApiResponse<DashboardStats>> => getMockDashboard(),

    getUsers: (): Promise<ApiResponse<{ users: User[] }>> => request<{ users: User[] }>('/admin/users'),

    getUser: (id: string): Promise<ApiResponse<User>> => request<User>(`/admin/users/${id}`),

    updateUser: (id: string, user: Partial<User>): Promise<ApiResponse<User>> =>
      request<User>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),

    deleteUser: (id: string): Promise<ApiResponse<{ message: string }>> =>
      request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),

    getCourts: (): Promise<ApiResponse<{ courts: Court[] }>> => request<{ courts: Court[] }>('/courts'),

    createCourt: (court: Partial<Court>): Promise<ApiResponse<Court>> =>
      request<Court>('/courts', { method: 'POST', body: JSON.stringify(court) }),

    updateCourt: (id: string, court: Partial<Court>): Promise<ApiResponse<Court>> =>
      request<Court>(`/courts/${id}`, { method: 'PUT', body: JSON.stringify(court) }),

    deleteCourt: (id: string): Promise<ApiResponse<{ message: string }>> =>
      request<{ message: string }>(`/courts/${id}`, { method: 'DELETE' }),

    getGames: (): Promise<ApiResponse<{ games: Game[] }>> => request<{ games: Game[] }>('/admin/games'),

    getGame: (id: string): Promise<ApiResponse<Game>> => request<Game>(`/admin/games/${id}`),

    deleteGame: (id: string): Promise<ApiResponse<{ message: string }>> =>
      request<{ message: string }>(`/admin/games/${id}`, { method: 'DELETE' }),

    // TODO: Replace with: return request<{ tournaments: Tournament[] }>('/admin/tournaments')
    getTournaments: (): Promise<ApiResponse<{ tournaments: Tournament[] }>> => getMockTournaments(),

    // TODO: Replace with: return request<{ tips: Tip[] }>('/admin/tips')
    getTips: (): Promise<ApiResponse<{ tips: Tip[] }>> => getMockTips(),

    // TODO: Replace with: return request<Tip>('/admin/tips', { method: 'POST', body: JSON.stringify(tip) })
    createTip: async (tip: Partial<Tip>): Promise<ApiResponse<Tip>> => {
      const newTip: Tip = {
        id: `t${Date.now()}`,
        content: tip.content || '',
        category: tip.category || 'technique',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { data: newTip, error: null };
    },

    // TODO: Replace with: return request<Tip>(`/admin/tips/${id}`, { method: 'PUT', body: JSON.stringify(tip) })
    updateTip: async (id: string, tip: Partial<Tip>): Promise<ApiResponse<Tip>> => {
      const updated = { id, ...tip, updatedAt: new Date().toISOString() } as Tip;
      return { data: updated, error: null };
    },

    // TODO: Replace with: return request<void>(`/admin/tips/${id}`, { method: 'DELETE' })
    deleteTip: async (_id: string): Promise<ApiResponse<void>> => {
      return { data: undefined as unknown as void, error: null };
    },
  },
};
