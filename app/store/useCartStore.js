import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore"; // ⭐ IMPORTANT

const useCartStore = create(
  persist(
    (set, get) => ({
      carts: [],

      // ⭐ BLOCK if not logged in
      ensureLoggedIn: () => {
        const { user } = useAuthStore.getState();
        if (!user) {
          toast.error("Please login first!");
          return false;
        }
        return true;
      },

      // Add item to cart
      addCart: (newCart) => {
        if (!get().ensureLoggedIn()) return; // ⛔ STOP if not logged in
        
        const { carts } = get();
        const existing = carts.find((c) => c.productId === newCart.productId);

        if (existing) {
          toast.error("Item already in cart!");
          return;
        }

        set((state) => ({ carts: [...state.carts, newCart] }));
        toast.success("Item added to cart!");
      },

      // Update cart quantity
      updateCartQuantity: (cartId, quantity) => {
        if (!get().ensureLoggedIn()) return;

        if (quantity < 1) return;

        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId ? { ...cart, quantity } : cart
          ),
        }));
      },

      // Increase quantity
      increaseQuantity: (cartId) => {
        if (!get().ensureLoggedIn()) return;

        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId
              ? { ...cart, quantity: cart.quantity + 1 }
              : cart
          ),
        }));
      },

      // Decrease quantity
      decreaseQuantity: (cartId) => {
        if (!get().ensureLoggedIn()) return;

        const { carts } = get();
        const cart = carts.find((c) => c.id === cartId);
        if (!cart) return;

        if (cart.quantity === 1) {
          set({ carts: carts.filter((c) => c.id !== cartId) });
          toast.success("Item removed from cart!");
        } else {
          set({
            carts: carts.map((c) =>
              c.id === cartId ? { ...c, quantity: c.quantity - 1 } : c
            ),
          });
        }
      },

      // Remove item
      removeCart: (cartId) => {
        if (!get().ensureLoggedIn()) return;

        set((state) => ({
          carts: state.carts.filter((cart) => cart.id !== cartId),
        }));
        toast.success("Item removed from cart!");
      },

      clearCart: () => {
        if (!get().ensureLoggedIn()) return;
        set({ carts: [] });
      },

      resetCart: () => set({ carts: [] }),

      getTotalItems: () => {
        const { carts } = get();
        return carts.reduce((total, cart) => total + cart.quantity, 0);
      },

      getTotalPrice: (products) => {
        const { carts } = get();
        return carts.reduce((total, cart) => {
          const product = products.find((p) => p.id === cart.productId);
          return total + (product?.price || 0) * cart.quantity;
        }, 0);
      },

      isInCart: (productId) => {
        const { carts } = get();
        return carts.some((cart) => cart.productId === productId);
      },

      getCartItem: (productId) => {
        const { carts } = get();
        return carts.find((cart) => cart.productId === productId);
      },

      updateCart: (cartId, updates) => {
        if (!get().ensureLoggedIn()) return;

        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId ? { ...cart, ...updates } : cart
          ),
        }));
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ carts: state.carts }),
    }
  )
);

export default useCartStore;
