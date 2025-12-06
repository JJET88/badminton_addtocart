"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false); // Desktop sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu toggle

  // 🔐 ADMIN PROTECTION
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/accessDeny");
    }
  }, [user, router]);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📬" },
    { name: "Products", path: "/dashboard/products", icon: "⭐" },
    { name: "View Sales", path: "/dashboard/sales", icon: "🕒" },
    { name: "Voucher", path: "/dashboard/voucher", icon: "▶" },
    { name: "Settings", path: "/dashboard/settings", icon: "📄" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={`
          bg-white border-r border-gray-200 p-5 transition-all duration-300 z-50
          fixed lg:sticky top-0 h-screen
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 w-64
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 px-2">
          <div className="flex items-center gap-3">
            {/* Desktop Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-full hidden lg:block"
              aria-label="Toggle sidebar"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Title */}
            {!collapsed && (
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            aria-label="Close menu"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-1">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)} // Close mobile menu on click
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-full transition
                  ${
                    active
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${collapsed ? "lg:justify-center lg:px-4" : "lg:px-6"}
                `}
              >
                <span className="text-lg">{item.icon}</span>

                {/* Hide text in collapsed mode (desktop only) */}
                <span className={`flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                  {item.name}
                </span>

                {/* Count */}
                {item.count && (
                  <span className={`text-sm text-gray-600 ${collapsed ? "lg:hidden" : ""}`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info (Bottom of sidebar) */}
        {user && (
          <div className={`mt-auto pt-6 border-t border-gray-200 ${collapsed ? "lg:hidden" : ""}`}>
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 bg-gray-50 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}