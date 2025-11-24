"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import emptyCartImg from "../assets/empty-cart.svg";

import Cart from "./Cart";
import useCartStore from "@/app/store/useCartStore";
import useProductStore from "@/app/store/useProductStore";
import CartHeader from "./CartHeader";
import PaymentSection from "./PaymentSection";
import { useToggle } from "@/app/context/ToggleContext";

const CartSection = () => {
	const { carts } = useCartStore();
	const { products, loading, fetchProducts } = useProductStore();
	const { toggle, openSection } = useToggle();

	useEffect(() => {
		fetchProducts(); // call fetch on mount
	}, [fetchProducts]);

	// Calculate total and tax
	const total = carts.reduce((acc, cart) => {
		const product = products.find((p) => p.id === cart.productId);
		return acc + (product?.price || 0) * cart.quantity;
	}, 0);
	const tax = total * 0.1;
	const netTotal = total + tax;
	console.log(carts);

	return (
		<>
			<div className=" bg-gray-50 min-h-screen ">
				<section className="flex flex-col min-h-screen bg-gray-50   max-w-7xl mx-auto px-4 sm:px-6">
					<CartHeader />
					<PaymentSection />
					{carts.length === 0 ? (
						<div className="flex flex-col items-center justify-center mt-20">
							<Image
								src={emptyCartImg}
								alt="Empty Cart"
								width={200}
								height={200}
								className=""
							/>
							<p className="text-lg text-gray-600 mt-4">
								Your cart is empty 😔
							</p>
							<Link
								href="/products"
								className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
							>
								Shop Now
							</Link>
						</div>
					) : (
						<>
							{/* Cart list */}
							<div className="flex-grow space-y-4">
								{carts.map((cart) => (
									<Cart key={cart.id} cart={cart} />
								))}
							</div>

							{/* Summary Card */}
							<div className="sticky bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 rounded-t-lg">
								<div className="grid grid-cols-3 gap-4 text-sm">
									<div className="text-center">
										<p className="text-gray-500">Total</p>
										<p className="font-semibold">${total.toFixed(2)}</p>
									</div>
									<div className="text-center">
										<p className="text-gray-500">Tax (10%)</p>
										<p className="font-semibold">${tax.toFixed(2)}</p>
									</div>
									<div className="text-center">
										<p className="text-gray-500">Net Total</p>
										<p className="text-xl font-bold">${netTotal.toFixed(2)}</p>
									</div>
								</div>
								<div className="text-center mt-4">
									<button
										onClick={openSection}
										className="w-full bg-green-600 text-white py-2 rounded-full font-medium hover:bg-green-700 transition"
									>
										Proceed to Checkout 💳
									</button>
								</div>
							</div>
						</>
					)}
				</section>
			</div>
		</>
	);
};

export default CartSection;
