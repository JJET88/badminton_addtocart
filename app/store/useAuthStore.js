"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      // -----------------------------
      // SET LOGGED-IN USER
      // -----------------------------
      setUser: (user) => {
        // Ensure "points" exists to avoid undefined
        const safeUser = {
          ...user,
          points: user?.points ?? 0,
        };
        set({ user: safeUser });
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
      clearUser: () => set({ user: null }),

      // AUTH HELPERS
      isAuthenticated: () => get().user !== null,
      isAdmin: () => get().user?.role === "admin",
      getUserId: () => get().user?.id,

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
          set({ isLoading: true });

          const res = await fetch("/api/auth/me");

          if (!res.ok) {
            set({ user: null, isLoading: false });
            return null;
          }

          const data = await res.json();

          const safeUser = {
            ...data.user,
            points: data.user?.points ?? 0,
          };

          set({ user: safeUser, isLoading: false });
          return safeUser;

        } catch (error) {
          console.error("Fetch user failed:", error);
          set({ user: null, isLoading: false });
          return null;
        }
      },

      // -----------------------------
      // LOGOUT
      // -----------------------------
      logout: async () => {
        try {
          set({ isLoading: true });

          await fetch("/api/auth/logout", {
            method: "POST",
          });

          set({ user: null, isLoading: false });

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        } catch (error) {
          console.error("Logout failed:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
