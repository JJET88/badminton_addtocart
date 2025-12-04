"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false); // ⭐ sidebar toggle

  const router = useRouter();
  const { user } = useAuthStore();


  // 🔐 ADMIN PROTECTION
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/accessDeny");
    }
  }, [user]);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📬", },
    { name: "Products", path: "/dashboard/products", icon: "⭐" },
    { name: "View Sales", path: "/dashboard/sales", icon: "🕒" },
    { name: "Voucher", path: "/dashboard/voucher", icon: "▶" },
    { name: "Settings", path: "/dashboard/settings", icon: "📄" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-gray-200 p-5 transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Hide title when collapsed */}
          {!collapsed && (
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          )}
        </div>

       

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-1">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-4 px-4 py-2 rounded-full transition
                  ${
                    active
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${collapsed ? "justify-center" : "px-6"}
                `}
              >
                <span className="text-lg">{item.icon}</span>

                {/* Hide text in collapsed mode */}
                {!collapsed && <span className="flex-1">{item.name}</span>}

                {/* Count */}
                {!collapsed && item.count && (
                  <span className="text-sm text-gray-600">{item.count}</span>
                )}
              </Link>
            );
          })}
        </nav>

       
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-7 bg-gray-50">{children}</main>
    </div>
  );
}
