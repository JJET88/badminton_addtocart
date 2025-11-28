"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Load Data
  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const res = await fetch("/api/sales");
    const data = await res.json();
    setSales(data || []);
  }

  // Revenue Calculations
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const today = new Date().toDateString();
  const todayRevenue = sales
    .filter((s) => new Date(s.createdAt).toDateString() === today)
    .reduce((sum, s) => sum + Number(s.total), 0);

  // Pagination Logic
  const totalPages = Math.ceil(sales.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentSales = sales.slice(startIndex, startIndex + pageSize);

  const goNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goPrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Sales Report</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Today Revenue</p>
          <h2 className="text-2xl font-bold mt-1">฿{todayRevenue.toFixed(2)}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-1">฿{totalRevenue.toFixed(2)}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold mt-1">{sales.length}</h2>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b text-left">
              <th className="py-3 px-4">Invoice</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
              <th className="py-3 px-4 text-right">Tax</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentSales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium">#{sale.id}</td>

                <td className="px-4">
                  {new Date(sale.createdAt).toLocaleString()}
                </td>

                <td className="px-4">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {sale.paymentType}
                  </span>
                </td>

                <td className="px-4 text-right">
                  ฿{Number(sale.subtotal).toFixed(2)}
                </td>

                <td className="px-4 text-right">
                  ฿{Number(sale.tax).toFixed(2)}
                </td>

                <td className="px-4 text-right font-semibold">
                  ฿{Number(sale.total).toFixed(2)}
                </td>

                <td className="px-4 text-right">
                  <Link
                    href={`/dashboard/sales/${sale.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <p className="text-gray-500 p-4 text-center">No sales recorded.</p>
        )}
      </div>

      {/* Pagination Controls */}
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
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
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
  );
}
