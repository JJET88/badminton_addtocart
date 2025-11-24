// app/dashboard/voucher/page.js
"use client";
import { useState } from "react";

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState([
    { 
      id: 1, 
      code: "SUMMER2025", 
      discount: "20%", 
      type: "Percentage",
      minPurchase: "$100",
      uses: 45,
      maxUses: 100,
      expiry: "2025-06-30",
      status: "Active" 
    },
    { 
      id: 2, 
      code: "WELCOME50", 
      discount: "$50", 
      type: "Fixed",
      minPurchase: "$200",
      uses: 120,
      maxUses: 200,
      expiry: "2025-12-31",
      status: "Active" 
    },
    { 
      id: 3, 
      code: "NEWYEAR15", 
      discount: "15%", 
      type: "Percentage",
      minPurchase: "$50",
      uses: 200,
      maxUses: 200,
      expiry: "2025-01-31",
      status: "Expired" 
    },
    { 
      id: 4, 
      code: "FLASH25", 
      discount: "25%", 
      type: "Percentage",
      minPurchase: "$150",
      uses: 5,
      maxUses: 50,
      expiry: "2025-02-28",
      status: "Active" 
    },
  ]);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    minPurchase: "",
    maxUses: "",
    expiry: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVoucher = {
      id: vouchers.length + 1,
      code: formData.code,
      discount: formData.type === "Percentage" ? `${formData.discount}%` : `${formData.discount}`,
      type: formData.type,
      minPurchase: `${formData.minPurchase}`,
      uses: 0,
      maxUses: parseInt(formData.maxUses),
      expiry: formData.expiry,
      status: "Active"
    };
    setVouchers([...vouchers, newVoucher]);
    setFormData({
      code: "",
      discount: "",
      type: "Percentage",
      minPurchase: "",
      maxUses: "",
      expiry: ""
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎟️ Voucher Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Active Vouchers</p>
          <p className="text-3xl font-bold text-green-600">
            {vouchers.filter(v => v.status === "Active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Redemptions</p>
          <p className="text-3xl font-bold text-blue-600">
            {vouchers.reduce((sum, v) => sum + v.uses, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Expired Vouchers</p>
          <p className="text-3xl font-bold text-red-600">
            {vouchers.filter(v => v.status === "Expired").length}
          </p>
        </div>
      </div>

      {/* Create Voucher Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Voucher</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voucher Code
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., SUMMER2025"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder={formData.type === "Percentage" ? "e.g., 20" : "e.g., 50"}
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Purchase ($)
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., 100"
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Uses
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., 100"
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium"
          >
            Create Voucher
          </button>
        </form>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Code</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Discount</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Min Purchase</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Usage</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Expiry</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                    {voucher.code}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-green-600">
                  {voucher.discount}
                </td>
                <td className="py-4 px-6">{voucher.type}</td>
                <td className="py-4 px-6">{voucher.minPurchase}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(voucher.uses / voucher.maxUses) * 100}%`}}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {voucher.uses}/{voucher.maxUses}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">{voucher.expiry}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      voucher.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {voucher.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}