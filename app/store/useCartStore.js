import { create } from "zustand";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  carts: [ {
      id: 1,
      productId: 19,
      quantity: 3,
    },
    {
      id: 2,
      productId: 20,
      quantity: 1,
    },],
    //  addCart: (newCart) => set((state) => ({ carts: [...state.carts, newCart] })),
  addCart: (newCart) => {
    const { carts } = get();
    const existing = carts.find((c) => c.productId === newCart.productId);
    if (existing) {
      toast.error("Item already in cart!");
      return;
    }
    set((state) => ({ carts: [...state.carts, newCart] }));
    // toast.success("Item added to cart!");
  },

  increaseQuantity: (cartId) => {
    set((state) => ({
      carts: state.carts.map((cart) =>
        cart.id === cartId
          ? { ...cart, quantity: cart.quantity + 1 }
          : cart
      ),
    }));
  },

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

  removeCart: (cartId) => {
    set((state) => ({
      carts: state.carts.filter((cart) => cart.id !== cartId),
    }));
    toast.success("Item removed from cart!");
  },

  resetCart: () => set({ carts: [] }),
}));

export default useCartStore;
