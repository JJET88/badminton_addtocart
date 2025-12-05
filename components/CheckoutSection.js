import { useToggle } from "@/context/ToggleContext";
import useCartStore from "@/app/store/useCartStore";
import useProductStore from "@/app/store/useProductStore";
import useAuthStore from "@/app/store/useAuthStore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutSection() {
	const router = useRouter();

	const [selected, setSelected] = useState("kplus");
	const [voucherCode, setVoucherCode] = useState("");
	const [appliedVoucher, setAppliedVoucher] = useState(null);
	const [voucherError, setVoucherError] = useState("");
	const [loading, setLoading] = useState(false);

	// Points redemption states
	const [pointsToRedeem, setPointsToRedeem] = useState("");
	const [redeemedPoints, setRedeemedPoints] = useState(0);
	const [pointsDiscount, setPointsDiscount] = useState(0);
	const [pointsError, setPointsError] = useState("");

	const { open, openSection, closeSection } = useToggle();
	const { carts, clearCart } = useCartStore();
	const { products, fetchProducts } = useProductStore();
	const { user, fetchUser } = useAuthStore();

	const POINTS_TO_DOLLAR_RATIO = 10; // 10 points = $1

	const showToast = (message, type = "info") => {
		if (type === "success") toast.success(message);
		else if (type === "error") toast.error(message);
		else toast(message);
	};
	

	const paymentMethods = [
		{
			id: "visa",
			name: "Visa",
			img: "https://i.pinimg.com/736x/5f/79/a6/5f79a6defe837d721dd2e3b2dba041e1.jpg",
		},
		{
			id: "kplus",
			name: "K Plus",
			img: "https://i.pinimg.com/736x/02/8f/b2/028fb2ab4360817776fae93b9dbc7178.jpg",
		},
		{
			id: "bbl",
			name: "BBL",
			img: "https://i.pinimg.com/1200x/8a/c5/4a/8ac54a0d2a234958cf6184d0955b4fda.jpg",
		},
		{
			id: "mastercard",
			name: "Mastercard",
			img: "https://i.pinimg.com/1200x/19/60/20/1960209695216f804bc94b98b9003825.jpg",
		},
		{
			id: "scb",
			name: "SCB",
			img: "https://i.pinimg.com/736x/21/6b/ba/216bbaef99f93b951bea4f85a1fb7543.jpg",
		},
		{
			id: "ktc",
			name: "KTC",
			img: "https://i.pinimg.com/736x/7a/ef/99/7aef99135a314e0d883346b8bdb22cb3.jpg",
		},
	];

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	// ----- CALCULATIONS -----
	const subtotal = carts.reduce((acc, cart) => {
		const product = products.find((p) => p.id === cart.productId);
		return acc + (product?.price || 0) * cart.quantity;
	}, 0);

	let voucherDiscount = 0;

	if (appliedVoucher) {
		if (appliedVoucher.type === "percentage") {
			voucherDiscount = (subtotal * appliedVoucher.amount) / 100;
		} else if (appliedVoucher.type === "fixed") {
			voucherDiscount = appliedVoucher.amount;
		}
	}

	const totalDiscount = voucherDiscount + pointsDiscount;
	const afterDiscount = Math.max(0, subtotal - totalDiscount);
	const tax = afterDiscount * 0.1;
	const total = afterDiscount + tax;

	// ----- APPLY VOUCHER -----
	async function applyVoucher() {
		if (!voucherCode.trim()) {
			setVoucherError("Please enter a voucher code");
			return;
		}

		try {
			const res = await fetch("/api/vouchers");
			const vouchers = await res.json();

			const voucher = vouchers.find(
				(v) => v.code.toUpperCase() === voucherCode.toUpperCase()
			);

			if (!voucher) {
				setVoucherError("Invalid voucher code");
				return;
			}

			if (voucher.minTotal && subtotal < voucher.minTotal) {
				setVoucherError(`Minimum purchase of $${voucher.minTotal} required`);
				return;
			}

			if (voucher.expiresAt) {
				const exp = new Date(voucher.expiresAt);
				if (exp < new Date()) {
					setVoucherError("This voucher has expired");
					return;
				}
			}

			setAppliedVoucher(voucher);
			setVoucherError("");
			showToast("Voucher applied successfully!", "success");
		} catch (err) {
			setVoucherError("Error applying voucher");
		}
	}

	function removeVoucher() {
		setAppliedVoucher(null);
		setVoucherCode("");
		setVoucherError("");
	}

	// ----- REDEEM POINTS -----
	function applyPoints() {
		const points = parseInt(pointsToRedeem);

		if (!points || points <= 0) {
			setPointsError("Please enter valid points");
			return;
		}

		if (!user) {
			setPointsError("Please login to redeem points");
			return;
		}

		if (points > (user.points || 0)) {
			setPointsError(`You only have ${user.points || 0} points`);
			return;
		}

		const discount = points / POINTS_TO_DOLLAR_RATIO;

		// Don't allow discount to exceed subtotal
		if (discount > subtotal) {
			setPointsError(`Maximum ${subtotal * POINTS_TO_DOLLAR_RATIO} points can be used`);
			return;
		}

		setRedeemedPoints(points);
		setPointsDiscount(discount);
		setPointsError("");
		showToast(`${points} points applied! ($${discount.toFixed(2)} discount)`, "success");
	}

	function removePoints() {
		setRedeemedPoints(0);
		setPointsDiscount(0);
		setPointsToRedeem("");
		setPointsError("");
	}

	function useAllPoints() {
		if (!user || !user.points) {
			setPointsError("You have no points to redeem");
			return;
		}

		const maxDiscount = subtotal;
		const maxPoints = Math.floor(maxDiscount * POINTS_TO_DOLLAR_RATIO);
		const pointsToUse = Math.min(user.points, maxPoints);

		setPointsToRedeem(pointsToUse.toString());
	}

	// ----- CONFIRM PAYMENT -----
	async function confirmPayment() {
		if (carts.length === 0) {
			alert("Your cart is empty");
			return;
		}

		console.log("🛒 Starting checkout with products:", products.map(p => ({
			id: p.id,
			name: p.title || p.name,
			stock: p.stock,
			hasStock: p.stock !== undefined
		})));

		setLoading(true);

		try {
			const paymentMethod =
				paymentMethods.find((m) => m.id === selected)?.name || selected;

			const salePayload = {
				total: parseFloat(total.toFixed(2)),
				subtotal: parseFloat(subtotal.toFixed(2)),
				tax: parseFloat(tax.toFixed(2)),
				discount: parseFloat(totalDiscount.toFixed(2)),
				paymentType: paymentMethod,
				voucherCode: appliedVoucher?.code || null,
				cashierId: user?.id || 1,
			};

			const saleRes = await fetch("/api/sales", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(salePayload),
			});

			if (!saleRes.ok) throw new Error("Failed to create sale");

			const sale = await saleRes.json();
			const saleId = sale.id;

			// SEND SALE ITEMS AND UPDATE STOCK
			for (const cart of carts) {
				const product = products.find((p) => p.id === cart.productId);

				console.log("🔍 Processing cart item:", {
					cartId: cart.id,
					productId: cart.productId,
					productIdType: typeof cart.productId,
					quantity: cart.quantity,
					product: product ? {
						id: product.id,
						idType: typeof product.id,
						name: product.title || product.name,
						currentStock: product.stock,
						stockType: typeof product.stock
					} : "NOT FOUND"
				});

				// ⚠️ TYPE CHECK - This might be the issue!
				if (!product) {
					console.error("❌ CRITICAL: Product not found in products array!", {
						lookingFor: cart.productId,
						availableIds: products.map(p => ({ id: p.id, type: typeof p.id }))
					});
				}

				const itemPayload = {
					saleId,
					productId: cart.productId,
					quantity: cart.quantity,
					price: product?.price || 0,
				};

				await fetch("/api/saleitems", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(itemPayload),
				});

				// UPDATE STOCK - reduce by quantity purchased
				if (product) {
					const currentStock = parseInt(product.stock) || 0;
					const purchaseQty = parseInt(cart.quantity) || 0;
					const newStock = currentStock - purchaseQty;
					const finalStock = Math.max(0, newStock);
					
					console.log(`📦 Attempting to update stock for product ${product.id}:`, {
						currentStock,
						purchaseQty,
						newStock,
						finalStock,
						productStockType: typeof product.stock,
						productStockValue: product.stock
					});
					
					const updatePayload = { stock: finalStock };
					console.log("📤 Sending payload:", updatePayload);
					
					const stockUpdateRes = await fetch(`/api/products/${product.id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(updatePayload),
					});

					const stockUpdateData = await stockUpdateRes.json();
					
					if (stockUpdateRes.ok) {
						console.log(`✅ Stock updated successfully:`, stockUpdateData);
					} else {
						console.error(`❌ Stock update failed (${stockUpdateRes.status}):`, stockUpdateData);
					}
				} else {
					console.error(`❌ Product not found in store for cart item:`, cart);
				}
			}

			// ===== HANDLE POINTS =====
			if (user?.id) {
				try {
					// Deduct redeemed points first
					if (redeemedPoints > 0) {
						await fetch("/api/users/redeem-points", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								userId: user.id,
								pointsToRedeem: redeemedPoints,
							}),
						});
					}

					// Then add 5 points for the purchase
					const pointsRes = await fetch("/api/users/add-points", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							userId: user.id,
							pointsToAdd: 5,
						}),
					});

					if (pointsRes.ok) {
						await fetchUser();
						if (redeemedPoints > 0) {
							showToast(`Payment successful! Redeemed ${redeemedPoints} points & earned 5 points! 🎉`, "success");
						} else {
							showToast("Payment successful! You earned 5 points! 🎉", "success");
						}
					} else {
						showToast("Payment successful.", "success");
					}
				} catch (pointsErr) {
					console.error("Failed to handle points:", pointsErr);
					showToast("Payment successful.", "success");
				}
			} else {
				showToast("Payment successful.", "success");
			}

			clearCart();
			closeSection();
			removeVoucher();
			removePoints();

		} catch (err) {
			console.error("Payment error:", err);
			showToast("Payment failed!", "error");
		} finally {
			setLoading(false);
			router.push(`/products`);
		}
	}

	return (
		<div>
			{/* OVERLAY */}
			<div
				className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 
            ${
							open
								? "opacity-100 pointer-events-auto"
								: "opacity-0 pointer-events-none"
						}`}
				onClick={closeSection}
			></div>

			{/* CHECKOUT DRAWER */}
			<div
				className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl z-50 transition-transform duration-500 
            ease-in-out overflow-y-auto ${
							open ? "translate-x-0" : "translate-x-full"
						}`}
			>
				<div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
					<h2 className="text-xl font-semibold">Checkout</h2>
					<button onClick={closeSection} className="text-gray-500 text-2xl">
						×
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* ORDER SUMMARY */}
					<div>
						<p className="text-lg font-semibold mb-3">Order Summary</p>
						<div className="bg-gray-50 rounded-lg p-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>

							{appliedVoucher && (
								<div className="flex justify-between text-sm text-green-600">
									<span>Voucher ({appliedVoucher.code})</span>
									<span>- ${voucherDiscount.toFixed(2)}</span>
								</div>
							)}

							{pointsDiscount > 0 && (
								<div className="flex justify-between text-sm text-yellow-600">
									<span>Points Discount ({redeemedPoints} pts)</span>
									<span>- ${pointsDiscount.toFixed(2)}</span>
								</div>
							)}

							<div className="flex justify-between text-sm">
								<span>Tax (10%)</span>
								<span>${tax.toFixed(2)}</span>
							</div>

							<div className="border-t pt-2 mt-2 flex justify-between font-bold">
								<span>Total</span>
								<span className="text-green-600">${total.toFixed(2)}</span>
							</div>

							{/* Points Reward Notice */}
							{user && (
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-3">
									<p className="text-xs text-yellow-800 text-center">
										⭐ Earn <span className="font-bold">5 points</span> with this purchase!
									</p>
								</div>
							)}
						</div>
					</div>

					{/* REDEEM POINTS SECTION */}
					{user && user.points > 0 && (
						<div>
							<div className="flex justify-between items-center mb-3">
								<p className="text-lg font-semibold">Redeem Points</p>
								<span className="text-sm text-gray-600">
									You have <span className="font-bold text-yellow-600">{user.points}</span> points
								</span>
							</div>

							{redeemedPoints > 0 ? (
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex justify-between items-center">
									<div>
										<p className="font-semibold text-yellow-800">
											{redeemedPoints} points redeemed
										</p>
										<p className="text-sm text-yellow-600">
											${pointsDiscount.toFixed(2)} discount applied
										</p>
									</div>
									<button onClick={removePoints} className="text-red-500 font-medium">
										Remove
									</button>
								</div>
							) : (
								<>
									<div className="flex gap-2">
										<input
											type="number"
											value={pointsToRedeem}
											onChange={(e) => setPointsToRedeem(e.target.value)}
											className="flex-1 border rounded-lg px-3 py-2"
											placeholder={`Enter points (${POINTS_TO_DOLLAR_RATIO} pts = $1)`}
											min="0"
											max={user.points}
										/>
										<button
											onClick={applyPoints}
											className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
										>
											Apply
										</button>
									</div>

									<button
										onClick={useAllPoints}
										className="mt-2 text-sm text-blue-600 hover:underline"
									>
										Use all available points
									</button>

									{pointsError && (
										<p className="text-sm text-red-500 mt-2">{pointsError}</p>
									)}

									<p className="text-xs text-gray-500 mt-2">
										💡 {POINTS_TO_DOLLAR_RATIO} points = $1 discount
									</p>
								</>
							)}
						</div>
					)}

					{/* PAYMENT METHODS */}
					<div>
						<p className="text-lg font-semibold mb-3">Payment Method</p>
						<div className="grid grid-cols-3 gap-3">
							{paymentMethods.map((m) => (
								<button
									key={m.id}
									onClick={() => setSelected(m.id)}
									className={`
                      p-3 rounded-lg border bg-gray-50
                      ${
												selected === m.id
													? "border-green-500 ring-2 ring-green-300"
													: "border-gray-200"
											}
                    `}
								>
									<img src={m.img} alt={m.name} className="h-8 w-auto" />
								</button>
							))}
						</div>
					</div>

					{/* VOUCHER SECTION */}
					<div>
						<p className="text-lg font-semibold mb-3">Promo Code</p>

						{appliedVoucher ? (
							<div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between">
								<div>
									<p className="font-semibold">{appliedVoucher.code}</p>
									<p className="text-sm text-green-600">
										{appliedVoucher.type === "percentage"
											? `${appliedVoucher.amount}% off`
											: `$${appliedVoucher.amount} off`}
									</p>
								</div>
								<button onClick={removeVoucher} className="text-red-500">
									Remove
								</button>
							</div>
						) : (
							<>
								<div className="flex gap-2">
									<input
										value={voucherCode}
										onChange={(e) =>
											setVoucherCode(e.target.value.toUpperCase())
										}
										className="flex-1 border rounded-lg px-3 py-2"
										placeholder="Enter voucher"
									/>
									<button
										onClick={applyVoucher}
										className="bg-blue-600 text-white px-4 py-2 rounded-lg"
									>
										Apply
									</button>
								</div>
								{voucherError && (
									<p className="text-sm text-red-500 mt-2">{voucherError}</p>
								)}
							</>
						)}
					</div>

					{/* CONFIRM PAYMENT */}
					<button
						onClick={confirmPayment}
						disabled={loading}
						className={`w-full py-3 rounded-lg font-semibold
                ${
									loading
										? "bg-gray-400"
										: "bg-green-600 text-white hover:bg-green-700"
								}`}
					>
						{loading
							? "Processing..."
							: `Confirm Payment ($${total.toFixed(2)})`}
					</button>

					<button
						onClick={closeSection}
						disabled={loading}
						className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}