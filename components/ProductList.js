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
  const productsPerPage = 6;


	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const categories = useMemo(
		() => [
			"All",
			...new Set(products.map((p) => p.category || "Uncategorized")),
		],
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
	 const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );
    const handleAddedBtn = (event) => {
		event.stopPropagation();
		showToast("Item is already in My Cart","error");
	};


	const handleAddToCart = (event, productId) => {
		event.stopPropagation();

		if (carts.find((c) => c.productId === productId)) {
			return showToast("Item already in cart!", "error");
		}

		addCart({
			id: Date.now(),
			productId,
			quantity: 1,
		});

		showToast("Added to cart!", "success");
	};

	if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading amazing products...</p>
      </div>
    );

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* HEADER */}
				<Header search={search} setSearch={setSearch} />


				<div className=" flex justify-center gap-5 py-3 font-semibold text-gray-700">
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

				{/* PRODUCTS */}
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
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>
                  
                  {p.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < Math.round(p.rating.rate) ? "" : "opacity-30"}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({p.rating.count})</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-indigo-600">
                      ${p.price}
                    </span>
                    <div className="flex gap-1">
                      <Link 
                        href={`/products/${p.id}`} 
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                        title="View"
                      >
                        view
                      </Link>
                      {carts.find((cart) => cart.productId === p.id) ? (
									<button
										onClick={(e) => handleAddedBtn(e)}
										className=" text-sm border px-3 py-3 text-white rounded-xl bg-blue-900 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
									>
										Added
									</button>
								) : (
									<button
										onClick={(e) => handleAddToCart(e, p.id)}
										className=" text-sm border  px-3 py-3 text-white rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
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
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700">No products found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
		
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
			</div>
		</div>
	);
}
