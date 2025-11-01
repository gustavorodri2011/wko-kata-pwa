import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AuthService } from '../utils/auth';

export const useAuth = () => {
  const { auth, setAuth } = useAppStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await AuthService.verifyToken();
        if (user) {
          setAuth({ currentUser: user, isAuthenticated: true });
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };

    if (!auth.isAuthenticated) {
      verifyAuth();
    }
  }, [auth.isAuthenticated, setAuth]);

  return auth;
};