import { User } from '../types';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app' 
  : '';

export interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  private static TOKEN_KEY = 'wko-auth-token';

  static async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  static async register(userData: {
    username: string;
    password: string;
    name: string;
    belt: string;
  }): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('Admin authentication required');

    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, adminToken: token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
  }

  static async verifyToken(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch {
      this.removeToken();
      return null;
    }
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static logout(): void {
    this.removeToken();
  }
}