// ==========================================
// Auth Hook — useAuth
// ==========================================

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setUser, setToken, logout as logoutAction, setLoading } from '../store/authSlice';
import { authService } from '../services/authService';
import { UserRole } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, token } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      try {
        dispatch(setLoading(true));
        const result = await authService.login(email, password, role);
        dispatch(setUser(result.user));
        dispatch(setToken(result.token));
        return result;
      } catch (error) {
        dispatch(setLoading(false));
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
    } catch (error) {
      // Still logout locally even if API fails
      dispatch(logoutAction());
    }
  }, [dispatch]);

  const restoreSession = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const savedUser = await authService.getCurrentUser();
      const savedToken = await authService.getToken();
      if (savedUser && savedToken) {
        dispatch(setUser(savedUser));
        dispatch(setToken(savedToken));
      } else {
        dispatch(setLoading(false));
      }
    } catch {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    restoreSession,
  };
};
