import { create } from "zustand";

// Optional: import your toast utility if available
// import { showToast } from "@/utils/toast";

const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/products", { cache: "no-store" }); // important for client-side fetching
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const rawData = await res.json();
      console.log("Fetched data:", rawData); // debug

      const formattedData = rawData.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: parseFloat(item.price) || 0,
        category: item.category,
        image: item.image,
        rating_rate: parseFloat(item.rating_rate) || 0,
        rating_count: parseInt(item.rating_count) || 0,
      }));

      set({ products: formattedData });
    } catch (error) {
      console.error("Error fetching products:", error);
      if (typeof showToast === "function") {
        showToast("❌ Failed to load products.", "error");
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
