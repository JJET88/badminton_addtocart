"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => {
        if (!user) {
          set({ user: null, error: null });
          return;
        }

        const safeUser = {
          ...user,
          points: user?.points ?? 0,
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role || "user",
        };
        set({ user: safeUser, error: null });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      updatePoints: (newPoints) =>
        set((state) => ({
          user: state.user ? { ...state.user, points: newPoints } : null,
        })),

      clearUser: () => set({ user: null, error: null }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      isAuthenticated: () => get().user !== null,
      isAdmin: () => get().user?.role === "admin",
      getUserId: () => get().user?.id,
      getUser: () => get().user,

      setLoading: (isLoading) => set({ isLoading }),

      // FIXED login - works with TiDB
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          console.log('🔐 Login attempt:', credentials.email);

          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
          });

          const data = await res.json();
          
          console.log('📥 Login response:', { 
            status: res.status, 
            hasUser: !!data.user,
            data 
          });

          if (!res.ok) {
            throw new Error(data.error || "Login failed");
          }

          // Validate response - handle both formats
          let userData;
          if (data.user) {
            userData = data.user;
          } else if (data.id) {
            // Direct user object
            userData = data;
          } else {
            throw new Error("Invalid user data received from server");
          }

          if (!userData.id) {
            throw new Error("User ID missing from response");
          }

          const safeUser = {
            id: userData.id,
            name: userData.name || 'Unknown',
            email: userData.email,
            role: userData.role || "user",
            points: userData.points ?? 0,
            created_at: userData.created_at || userData.createdAt,
            createdAt: userData.createdAt || userData.created_at,
            updatedAt: userData.updatedAt,
          };

          console.log('✅ Login successful:', safeUser);
          set({ user: safeUser, isLoading: false, error: null });
          
          return { success: true, user: safeUser };

        } catch (error) {
          console.error("❌ Login failed:", error);
          const errorMessage = error.message || "Login failed";
          set({ user: null, isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // Fetch user data by ID (alternative to /api/auth/me)
      fetchUser: async () => {
        const currentUser = get().user;
        
        if (!currentUser || !currentUser.id) {
          console.log('ℹ️ No user to fetch');
          set({ isLoading: false });
          return null;
        }

        try {
          set({ isLoading: true, error: null });

          console.log('🔄 Fetching user data for ID:', currentUser.id);

          // Use /api/users/[id] instead of /api/auth/me since it doesn't exist
          const res = await fetch(`/api/users/${currentUser.id}`, {
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('📥 Fetch response status:', res.status);

          // Handle 404 - user not found
          if (res.status === 404) {
            console.log('❌ User not found, clearing session');
            set({ user: null, isLoading: false, error: null });
            return null;
          }

          // Handle other non-ok responses
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
              error: `Server error: ${res.status}` 
            }));
            throw new Error(errorData.error || "Failed to fetch user");
          }

          const data = await res.json();
          
          console.log('📥 Received user data:', data);

          // Validate data
          if (!data || typeof data !== 'object') {
            throw new Error("Invalid response format");
          }

          if (!data.id || !data.email) {
            throw new Error("Missing required user fields (id, email)");
          }

          const safeUser = {
            id: data.id,
            name: data.name || 'Unknown',
            email: data.email,
            role: data.role || "user",
            points: data.points ?? 0,
            created_at: data.created_at,
            createdAt: data.created_at,
            updatedAt: data.updatedAt,
          };

          console.log('✅ User data updated:', safeUser);
          set({ user: safeUser, isLoading: false, error: null });
          
          return safeUser;

        } catch (error) {
          console.error("❌ Fetch user failed:", error);
          const errorMessage = error.message || "Failed to fetch user";
          set({ isLoading: false, error: errorMessage });
          // Don't clear user on fetch error, keep existing data
          return get().user;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          console.log('👋 Logging out');

          // Try to call logout endpoint if it exists
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
          } catch (err) {
            // Ignore logout endpoint errors
            console.log('Logout endpoint not available or failed, clearing locally');
          }

          set({ user: null, isLoading: false, error: null });

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return { success: true };

        } catch (error) {
          console.error("Logout failed:", error);
          set({ user: null, isLoading: false, error: null });
          
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return { success: false, error: error.message };
        }
      },

      refreshUser: async () => {
        const currentUser = get().user;
        if (!currentUser) return null;

        try {
          console.log('🔄 Refreshing user data');
          
          const res = await fetch(`/api/users/${currentUser.id}`, {
            credentials: "include",
          });

          if (!res.ok) {
            console.log('Failed to refresh, keeping current user data');
            return currentUser;
          }

          const data = await res.json();
          
          if (!data || !data.id) {
            return currentUser;
          }

          const safeUser = {
            id: data.id,
            name: data.name || currentUser.name,
            email: data.email,
            role: data.role || "user",
            points: data.points ?? 0,
            created_at: data.created_at,
            createdAt: data.created_at,
            updatedAt: data.updatedAt,
          };

          console.log('✅ User refreshed:', safeUser);
          set({ user: safeUser });
          
          return safeUser;

        } catch (error) {
          console.error("Refresh user failed:", error);
          return currentUser;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;