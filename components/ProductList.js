/* eslint-disable @next/next/no-img-element */
"use client";
import useCartStore from "@/app/store/useCartStore";
import useProductStore from "@/app/store/useProductStore";
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Slideshow from "./Slideshow";
import Header from "./Header";

const showToast = (message, type = "info") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else toast(message);
};

const slideshowImages = [
  "https://li-ning.co.uk/wp-content/uploads/2022/04/aeronaut-9000-combat-11.jpg-1.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsDCuTLNw-C54SaOmwzjyLx1_zKcPp4hT3jQ&s",
  "https://shop.r10s.jp/starracket/cabinet/2025/nf-1000g.jpg",
];

export default function ProductList() {
  const { carts, addCart } = useCartStore();
  const { products, loading, fetchProducts } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // RESET PAGE WHEN SEARCH OR CATEGORY CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = products;

    if (search) {
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [products, search, selectedCategory]);

  // ✅ FIX: Calculate total pages based on FILTERED products, not all products
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const goNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goPrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const handleAddedBtn = (event) => {
    event.stopPropagation();
    showToast("Item is already in My Cart", "error");
  };

  const handleAddToCart = (event, productId) => {
    event.stopPropagation();

    if (carts.find((c) => c.productId === productId)) {
      return showToast("Item already in cart!", "error");
    }

    // ✅ CORRECT: Only add to cart, DON'T update stock here
    addCart({
      id: Date.now(),
      productId,
      quantity: 1,
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
          Loading amazing products...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <Header search={search} setSearch={setSearch} />

        {/* CATEGORY FILTER */}
        <div className="flex justify-center gap-5 py-3 font-semibold text-gray-700">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SLIDESHOW */}
        <div className="max-w-5xl mx-auto my-8">
          <Slideshow images={slideshowImages} />
        </div>

        {/* PRODUCT GRID */}
        {currentProducts.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.map((p) => (
              <li
                key={p.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <Link
                  href={`/products/${p.id}`}
                  className="block relative overflow-hidden bg-gray-50 aspect-square"
                >
                  <img
                    src={p.image || p.imageUrl}
                    alt={p.title || p.name}
                    className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  />
                  {p.category && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                      {p.category}
                    </span>
                  )}
                </Link>

                <div className="p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                    {p.title || p.name}
                  </h2>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-indigo-600">
                      ${p.price}
                    </span>

                    <div className="flex gap-1">
                      <Link
                        href={`/products/${p.id}`}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        view
                      </Link>

                      {carts.find((cart) => cart.productId === p.id) ? (
                        <button
                          onClick={(e) => handleAddedBtn(e)}
                          className="text-sm border px-3 py-3 text-white rounded-xl bg-blue-900 hover:bg-blue-700 transition-all"
                        >
                          Added
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(e, p.id)}
                          className="text-sm border px-3 py-3 text-white rounded-xl bg-blue-600 hover:bg-blue-700 transition-all"
                        >
                          Add Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-gray-700">
              No products found
            </p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6">
          {/* Page size selection */}
          <div>
            <label className="mr-2 text-gray-600">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // reset page
              }}
              className="border px-3 py-1 rounded"
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}