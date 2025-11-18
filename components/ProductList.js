/* eslint-disable @next/next/no-img-element */
"use client";
import useCartStore from "@/app/store/useCartStore";
import useProductStore from "@/app/store/useProductStore";
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Slideshow from "./Slideshow";
import { CgProfile } from "react-icons/cg";
import { PiShoppingCart } from "react-icons/pi";
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

	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

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
			<div className="min-h-screen flex justify-center items-center">
				<span className="text-blue-600 text-lg animate-pulse">
					Loading products...
				</span>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto">
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
				<div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ">
					{filteredProducts.map(({ id, title, price, image }) => (
						<div
							key={id}
							className="bg-white border border-gray-300 rounded-lg p-4 shadow text-center"
						>
              <Link href={`/products/${id}`}>
              
							<div className=" h-40 flex items-center justify-center rounded-md mb-4">
								{image ? (
									<img
										src={image}
										alt={title}
										className="h-full object-contain"
									/>
								) : (
									"PLACEHOLDER FOR ITEM PHOTO"
								)}
							</div>
              </Link>

							<p className="font-bold text-gray-800 text-sm">{title}</p>
							<p className="text-gray-500 mb-3">$ {price}</p>

							{carts.find((cart) => cart.productId === id) ? (
								<button className="w-full py-2 rounded bg-black text-white cursor-not-allowed">
									Added
								</button>
							) : (
								<button
									className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
									onClick={(e) => handleAddToCart(e, id)}
								>
									Buy Product
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
