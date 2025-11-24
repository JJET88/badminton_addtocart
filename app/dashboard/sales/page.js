// app/dashboard/sales/page.js
"use client";
import { useState } from "react";

export default function ViewSalesPage() {
  const [sales] = useState([
    { 
      id: "#SALE-001", 
      date: "2025-01-15", 
      customer: "John Doe", 
      product: "Laptop Pro",
      quantity: 1,
      amount: "$1,299",
      status: "Completed" 
    },
    { 
      id: "#SALE-002", 
      date: "2025-01-15", 
      customer: "Jane Smith", 
      product: "Wireless Mouse",
      quantity: 3,
      amount: "$87",
      status: "Completed" 
    },
    { 
      id: "#SALE-003", 
      date: "2025-01-14", 
      customer: "Mike Johnson", 
      product: "Monitor 27\"",
      quantity: 2,
      amount: "$798",
      status: "Processing" 
    },
    { 
      id: "#SALE-004", 
      date: "2025-01-14", 
      customer: "Sarah Wilson", 
      product: "Keyboard Mechanical",
      quantity: 1,
      amount: "$89",
      status: "Completed" 
    },
    { 
      id: "#SALE-005", 
      date: "2025-01-13", 
      customer: "Tom Brown", 
      product: "USB-C Cable",
      quantity: 5,
      amount: "$75",
      status: "Refunded" 
    },
    { 
      id: "#1021", 
      date: "2025-11-23", 
      customer: "John Doe", 
      product: "Wireless Headphones",
      quantity: 1,
      amount: "$75",
      status: "Completed" 
    },
    { 
      id: "#1020", 
      date: "2025-11-22", 
      customer: "Anna Kim", 
      product: "Phone Case",
      quantity: 2,
      amount: "$50",
      status: "Completed" 
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredSales = sales.filter(sale => {
    const statusMatch = filterStatus === "All Status" || sale.status === filterStatus;
    const startDateMatch = !startDate || sale.date >= startDate;
    const endDateMatch = !endDate || sale.date <= endDate;
    return statusMatch && startDateMatch && endDateMatch;
  });

  const totalSales = "$4,230";
  const totalTransactions = filteredSales.length;
  const completedSales = filteredSales.filter(s => s.status === "Completed").length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📈 View Sales</h1>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">{totalSales}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Completed Sales</p>
          <p className="text-3xl font-bold text-purple-600">{completedSales}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Processing</option>
              <option>Refunded</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setFilterStatus("All Status");
              }}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Qty</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{sale.id}</td>
                    <td className="py-4 px-6">{sale.date}</td>
                    <td className="py-4 px-6">{sale.customer}</td>
                    <td className="py-4 px-6">{sale.product}</td>
                    <td className="py-4 px-6">{sale.quantity}</td>
                    <td className="py-4 px-6 font-semibold">{sale.amount}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          sale.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : sale.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                    No sales found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}