import { User } from '@shared/schema';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const getAuthState = (): AuthState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

export const setAuthState = (user: User, token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthState = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
