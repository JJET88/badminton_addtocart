"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      // Save logged-in user
      setUser: (user) => set({ user }),

      // Update user data (partial update)
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),

      // Clear user without API call (for client-side clearing)
      clearUser: () => set({ user: null }),

      // Check if user is authenticated
      isAuthenticated: () => get().user !== null,

      // Check if user is admin
      isAdmin: () => get().user?.role === "admin",

      // Get user ID
      getUserId: () => get().user?.id,

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Fetch current user from API
      fetchUser: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/auth/me");
          
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user, isLoading: false });
            return data.user;
          } else {
            set({ user: null, isLoading: false });
            return null;
          }
        } catch (error) {
          console.error("Fetch user failed:", error);
          set({ user: null, isLoading: false });
          return null;
        }
      },

      // Logout user
      logout: async () => {
        try {
          set({ isLoading: true });
          
          await fetch("/api/auth/logout", {
            method: "POST",
          });

          // Clear Zustand state
          set({ user: null, isLoading: false });

          // Redirect to login page
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
      name: "auth-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export default useAuthStore;