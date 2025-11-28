import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useCartStore = create(
  persist(
    (set, get) => ({
      carts: [],

      // Add item to cart
      addCart: (newCart) => {
        const { carts } = get();
        const existing = carts.find((c) => c.productId === newCart.productId);
        
        if (existing) {
          toast.error("Item already in cart!");
          return;
        }
        
        set((state) => ({ carts: [...state.carts, newCart] }));
        toast.success("Item added to cart!");
      },

      // Update cart item quantity
      updateCartQuantity: (cartId, quantity) => {
        if (quantity < 1) return;
        
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId ? { ...cart, quantity } : cart
          ),
        }));
      },

      // Increase quantity
      increaseQuantity: (cartId) => {
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

      // Remove specific item from cart
      removeCart: (cartId) => {
        set((state) => ({
          carts: state.carts.filter((cart) => cart.id !== cartId),
        }));
        toast.success("Item removed from cart!");
      },

      // Clear entire cart (after successful checkout)
      clearCart: () => {
        set({ carts: [] });
        // toast.success("Cart cleared!");
      },

      // Reset cart (same as clearCart but without toast)
      resetCart: () => set({ carts: [] }),

      // Get total items count
      getTotalItems: () => {
        const { carts } = get();
        return carts.reduce((total, cart) => total + cart.quantity, 0);
      },

      // Get total price (requires products data)
      getTotalPrice: (products) => {
        const { carts } = get();
        return carts.reduce((total, cart) => {
          const product = products.find((p) => p.id === cart.productId);
          return total + (product?.price || 0) * cart.quantity;
        }, 0);
      },

      // Check if product is in cart
      isInCart: (productId) => {
        const { carts } = get();
        return carts.some((cart) => cart.productId === productId);
      },

      // Get cart item by product ID
      getCartItem: (productId) => {
        const { carts } = get();
        return carts.find((cart) => cart.productId === productId);
      },

      // Update cart item
      updateCart: (cartId, updates) => {
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === cartId ? { ...cart, ...updates } : cart
          ),
        }));
      },
    }),
    {
      name: "cart-storage", // localStorage key
      partialize: (state) => ({ carts: state.carts }), // Only persist carts array
    }
  )
);

export default useCartStore;