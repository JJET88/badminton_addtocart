/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useCartStore from "@/app/store/useCartStore";
import useAuthStore from "@/app/store/useAuthStore";
import { CgProfile } from "react-icons/cg";
import { PiShoppingCart } from "react-icons/pi";
import { FiLogOut, FiUser, FiSettings, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";

export default function Header({ search, setSearch }) {
	const { carts } = useCartStore();
	const user = useAuthStore((s) => s.user);
	const fetchUser = useAuthStore((s) => s.fetchUser);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const logout = useAuthStore((s) => s.logout);
	
	const [showDropdown, setShowDropdown] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	// Fetch fresh user data on component mount and periodically
	useEffect(() => {
		if (isAuthenticated()) {
			fetchUser();
		}
	}, [isAuthenticated, fetchUser]);

	// Auto-refresh user data every 30 seconds to keep points in sync
	useEffect(() => {
		if (!isAuthenticated()) return;

		const interval = setInterval(() => {
			fetchUser();
		}, 30000); // 30 seconds

		return () => clearInterval(interval);
	}, [isAuthenticated, fetchUser]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (showDropdown && !e.target.closest('.profile-dropdown-container')) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showDropdown]);

	return (
		<header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-xl sticky top-0 z-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 sm:h-20">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-bold hover:opacity-80 transition-opacity"
					>
						<span className="text-3xl sm:text-4xl">🏸</span>
						<span className="hidden sm:inline">TawBayin</span>
						<span className="sm:hidden text-lg">TB</span>
					</Link>

					{/* Desktop Search Bar */}
					<div className="hidden md:flex flex-1 max-w-2xl mx-8">
						<input
							type="text"
							placeholder="Search products..."
							className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{/* Desktop Right Side */}
					<div className="hidden md:flex items-center gap-4">
						{/* Cart Button */}
						<Link
							href="/carts"
							className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-transparent hover:border-green-500 transition-all shadow-sm hover:shadow-md group"
						>
							<PiShoppingCart className="text-2xl text-gray-700 group-hover:text-green-600 transition-colors" />

							{carts.length > 0 && (
								<span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1 text-[11px] font-bold bg-green-500 text-white rounded-full shadow-lg animate-bounce">
									{carts.length > 99 ? "99+" : carts.length}
								</span>
							)}
						</Link>

						{/* Profile */}
						<div className="relative profile-dropdown-container">
							{isAuthenticated() && user ? (
								<>
									{/* Profile Button */}
									<button
										onClick={() => setShowDropdown(!showDropdown)}
										className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all relative"
									>
										{/* Avatar */}
										<div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md relative">
											{user.name?.charAt(0).toUpperCase() || "U"}

											{/* Small Points Badge */}
											{user.points > 0 && (
												<span className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
													{user.points > 999 ? "999+" : user.points}
												</span>
											)}
										</div>

										<span className="text-sm font-medium max-w-[100px] truncate">
											{user.name?.split(" ")[0] || "User"}
										</span>

										<svg
											className={`w-4 h-4 transition-transform ${
												showDropdown ? "rotate-180" : ""
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{/* Dropdown */}
									{showDropdown && (
										<div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
											{/* User Info */}
											<div className="px-4 py-3 border-b border-gray-100">
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<p className="text-sm font-semibold text-gray-900 truncate">
															{user.name}
														</p>
														<p className="text-xs text-gray-500 truncate mt-0.5">
															{user.email}
														</p>
													</div>
													
													<span
														className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
															user.role === "admin"
																? "bg-purple-100 text-purple-700"
																: "bg-blue-100 text-blue-700"
														}`}
													>
														{user.role?.toUpperCase()}
													</span>
												</div>

												{/* Points Display - Prominent */}
												<div className="mt-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2">
													<div className="flex items-center justify-between">
														<span className="text-xs font-medium text-yellow-800">
															⭐ Reward Points
														</span>
														<span className="text-lg font-bold text-yellow-900">
															{user.points ?? 0}
														</span>
													</div>
													<p className="text-[10px] text-yellow-600 mt-0.5">
														10 points = $1 discount
													</p>
												</div>
											</div>

											{/* Menu Items */}
											<Link
												href={`/userProfile/${user.id}`}
												onClick={() => setShowDropdown(false)}
												className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											>
												<FiUser className="text-lg text-blue-600" />
												<span className="font-medium">My Profile</span>
											</Link>

											<Link
												href="/purchase-history"
												onClick={() => setShowDropdown(false)}
												className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											>
												<FiShoppingBag className="text-lg text-green-600" />
												<span className="font-medium">Purchase History</span>
											</Link>

											{user.role === "admin" && (
												<Link
													href="/dashboard"
													onClick={() => setShowDropdown(false)}
													className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
												>
													<FiSettings className="text-lg text-purple-600" />
													<span className="font-medium">Admin Dashboard</span>
												</Link>
											)}

											<hr className="my-2 border-gray-100" />

											<button
												onClick={() => {
													setShowDropdown(false);
													logout();
												}}
												className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
											>
												<FiLogOut className="text-lg" />
												Logout
											</button>
										</div>
									)}
								</>
							) : (
								<Link
									href="/login"
									className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-800 font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
								>
									<CgProfile className="text-xl" />
									<span>Login</span>
								</Link>
							)}
						</div>
					</div>

					{/* Mobile Menu Button & Cart */}
					<div className="flex md:hidden items-center gap-3">
						{/* Mobile Cart */}
						<Link href="/carts" className="relative">
							<PiShoppingCart className="text-3xl" />
							{carts.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{carts.length > 9 ? "9+" : carts.length}
								</span>
							)}
						</Link>

						{/* Mobile Menu Toggle */}
						<button
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="text-white p-2"
						>
							{showMobileMenu ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
						</button>
					</div>
				</div>

				{/* Mobile Search */}
				<div className="md:hidden pb-4">
					<input
						type="text"
						placeholder="Search products..."
						className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Mobile Menu */}
			{showMobileMenu && (
				<div className="md:hidden bg-white text-gray-900 border-t border-gray-200 shadow-lg">
					{isAuthenticated() && user ? (
						<>
							{/* User Info */}
							<div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
										{user.name?.charAt(0).toUpperCase() || "U"}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm truncate">{user.name}</p>
										<p className="text-xs text-gray-600 truncate">{user.email}</p>
									</div>
								</div>
								
								{/* Mobile Points Display */}
								<div className="mt-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium text-yellow-800">
											⭐ Reward Points
										</span>
										<span className="text-2xl font-bold text-yellow-900">
											{user.points ?? 0}
										</span>
									</div>
								</div>
							</div>

							<Link
								href={`/userProfile/${user.id}`}
								onClick={() => setShowMobileMenu(false)}
								className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
							>
								<FiUser className="text-xl text-blue-600" />
								<span className="font-medium">My Profile</span>
							</Link>

							<Link
								href="/purchase-history"
								onClick={() => setShowMobileMenu(false)}
								className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
							>
								<FiShoppingBag className="text-xl text-green-600" />
								<span className="font-medium">Purchase History</span>
							</Link>

							{user.role === "admin" && (
								<Link
									href="/dashboard"
									onClick={() => setShowMobileMenu(false)}
									className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
								>
									<FiSettings className="text-xl text-purple-600" />
									<span className="font-medium">Admin Dashboard</span>
								</Link>
							)}

							<button
								onClick={() => {
									setShowMobileMenu(false);
									logout();
								}}
								className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 border-t border-gray-200"
							>
								<FiLogOut className="text-xl" />
								<span className="font-medium">Logout</span>
							</button>
						</>
					) : (
						<Link
							href="/login"
							onClick={() => setShowMobileMenu(false)}
							className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50"
						>
							<CgProfile className="text-2xl text-blue-600" />
							<span className="font-medium">Login</span>
						</Link>
					)}
				</div>
			)}
		</header>
	);
}