"use client";
import { ShoppingCart, Package, Tag, Receipt, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="px-4 py-2 rounded-md hover:bg-gray-200">
            Overview
          </Link>
          <Link href="/products" className="px-4 py-2 rounded-md hover:bg-gray-200">
            Products
          </Link>
          <Link href="/sales" className="px-4 py-2 rounded-md hover:bg-gray-200">
            Sales
          </Link>
          <Link href="/voucher" className="px-4 py-2 rounded-md hover:bg-gray-200">
            Vouchers
          </Link>
          <Link href="/carts" className="px-4 py-2 rounded-md hover:bg-gray-200">
            Carts
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Page Title */}
        <h2 className="text-3xl font-semibold mb-6">Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <Package size={36} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-xl font-semibold">128</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <ShoppingCart size={36} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <h3 className="text-xl font-semibold">34</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <Tag size={36} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Active Vouchers</p>
              <h3 className="text-xl font-semibold">6</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <BarChart3 size={36} className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Monthly Sales</p>
              <h3 className="text-xl font-semibold">$12,450</h3>
            </div>
          </div>

        </div>

        {/* Recent Sales */}
        <div className="bg-white shadow rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Sales</h3>

          <div className="space-y-4">

            <div className="flex justify-between pb-4 border-b">
              <div>
                <p className="font-semibold">Order #1001</p>
                <span className="text-gray-500 text-sm">2 items</span>
              </div>
              <p className="font-bold">$129.99</p>
            </div>

            <div className="flex justify-between pb-4 border-b">
              <div>
                <p className="font-semibold">Order #1002</p>
                <span className="text-gray-500 text-sm">1 item</span>
              </div>
              <p className="font-bold">$39.99</p>
            </div>

            <div className="flex justify-between pb-4 border-b">
              <div>
                <p className="font-semibold">Order #1003</p>
                <span className="text-gray-500 text-sm">4 items</span>
              </div>
              <p className="font-bold">$210.00</p>
            </div>

          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

          <Link href="/dashboard/products">
            <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow text-center">
              Manage Products
            </div>
          </Link>

          <Link href="/sales">
            <div className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow text-center">
              View Sales
            </div>
          </Link>

          <Link href="/voucher">
            <div className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl shadow text-center">
              Voucher Settings
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}
