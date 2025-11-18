import { create } from "zustand";




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
        price: parseFloat(item.price),
        category: item.category,
        image: item.image,
        rating_rate: item.rating_rate, // fix field name
        rating_count: item.rating_count, // fix field name
      }));

      set({ products: formattedData });
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("❌ Failed to load products.", "error");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
