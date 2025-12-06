"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // -----------------------------
      // SET LOGGED-IN USER
      // -----------------------------
      setUser: (user) => {
        if (!user) {
          set({ user: null, error: null });
          return;
        }

        // Ensure required fields exist
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

      // -----------------------------
      // UPDATE USER (partial update)
      // Example: updateUser({ points: newPoints })
      // -----------------------------
      updateUser: (userData) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...userData }
            : null,
        })),

      // -----------------------------
      // UPDATE ONLY POINTS
      // Call after successful transaction
      // -----------------------------
      updatePoints: (newPoints) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, points: newPoints }
            : null,
        })),

      // -----------------------------
      // CLEAR USER
      // -----------------------------
      clearUser: () => set({ user: null, error: null }),

      // -----------------------------
      // SET ERROR
      // -----------------------------
      setError: (error) => set({ error }),

      // -----------------------------
      // CLEAR ERROR
      // -----------------------------
      clearError: () => set({ error: null }),

      // AUTH HELPERS
      isAuthenticated: () => get().user !== null,
      isAdmin: () => get().user?.role === "admin",
      getUserId: () => get().user?.id,
      getUser: () => get().user,

      // -----------------------------
      // LOADING STATE
      // -----------------------------
      setLoading: (isLoading) => set({ isLoading }),

      // -----------------------------
      // FETCH USER FROM /api/auth/me
      // ALWAYS ensures points default (0)
      // -----------------------------
      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });

          const res = await fetch("/api/auth/me", {
            credentials: "include", // Important for cookies
          });

          if (!res.ok) {
            // If 401, user is not authenticated
            if (res.status === 401) {
              set({ user: null, isLoading: false, error: null });
              return null;
            }

            // Other errors
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to fetch user");
          }

          const data = await res.json();

          // Validate response structure
          if (!data.user || !data.user.id) {
            throw new Error("Invalid user data received");
          }

          const safeUser = {
            ...data.user,
            points: data.user?.points ?? 0,
            role: data.user?.role || "user",
          };

          set({ user: safeUser, isLoading: false, error: null });
          return safeUser;

        } catch (error) {
          console.error("Fetch user failed:", error);
          const errorMessage = error.message || "Failed to fetch user";
          set({ user: null, isLoading: false, error: errorMessage });
          return null;
        }
      },

      // -----------------------------
      // LOGIN
      // -----------------------------
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });

          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Login failed");
          }

          const data = await res.json();

          const safeUser = {
            ...data.user,
            points: data.user?.points ?? 0,
            role: data.user?.role || "user",
          };

          set({ user: safeUser, isLoading: false, error: null });
          return { success: true, user: safeUser };

        } catch (error) {
          console.error("Login failed:", error);
          const errorMessage = error.message || "Login failed";
          set({ user: null, isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      // -----------------------------
      // LOGOUT
      // -----------------------------
      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          // Clear user regardless of API response
          set({ user: null, isLoading: false, error: null });

          // Only log error if request failed, but still clear state
          if (!res.ok) {
            console.error("Logout API call failed, but user cleared locally");
          }

          // Redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return { success: true };

        } catch (error) {
          console.error("Logout failed:", error);
          // Still clear user even if API fails
          set({ user: null, isLoading: false, error: null });
          
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return { success: false, error: error.message };
        }
      },

      // -----------------------------
      // REFRESH USER (silent refetch)
      // -----------------------------
      refreshUser: async () => {
        const currentUser = get().user;
        if (!currentUser) return null;

        try {
          const res = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (!res.ok) {
            return currentUser; // Keep existing user on error
          }

          const data = await res.json();
          const safeUser = {
            ...data.user,
            points: data.user?.points ?? 0,
            role: data.user?.role || "user",
          };

          set({ user: safeUser });
          return safeUser;

        } catch (error) {
          console.error("Refresh user failed:", error);
          return currentUser; // Keep existing user on error
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        // Don't persist loading or error states
      }),
    }
  )
);

export default useAuthStore;