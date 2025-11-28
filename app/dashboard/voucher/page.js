"use client";

import { useState, useEffect } from "react";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form fields
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [amount, setAmount] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    loadVouchers();
  }, []);

  async function loadVouchers() {
    const res = await fetch("/api/vouchers");
    const data = await res.json();
    setVouchers(data || []);
  }

  function openCreateForm() {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  }

  function openEditForm(v) {
    setCode(v.code);
    setType(v.type);
    setAmount(v.amount.toString());
    setMinTotal(v.minTotal?.toString() || "");
    setExpiresAt(v.expiresAt ? v.expiresAt.split("T")[0] : "");
    setCurrentId(v.id);
    setIsEditing(true);
    setShowForm(true);
  }

  function resetForm() {
    setCode("");
    setType("percentage");
    setAmount("");
    setMinTotal("");
    setExpiresAt("");
    setCurrentId(null);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  async function handleSubmit() {
    if (!code || !amount) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      code,
      type,
      amount: Number(amount),
      minTotal: minTotal ? Number(minTotal) : null,
      expiresAt: expiresAt || null,
    };

    if (isEditing) {
      await fetch(`/api/vouchers/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    closeForm();
    loadVouchers();
  }

  async function deleteVoucher(id) {
    if (!confirm("Are you sure you want to delete this voucher?")) return;

    await fetch(`/api/vouchers/${id}`, {
      method: "DELETE",
    });

    loadVouchers();
  }

  function formatDate(dateString) {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Vouchers</h1>
          <button
            onClick={openCreateForm}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Voucher
          </button>
        </div>

        {/* Vouchers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Min Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-blue-600">
                        {v.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {v.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {v.type === "percentage" ? `${v.amount}%` : `$${v.amount}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {v.minTotal ? `$${v.minTotal}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(v.expiresAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditForm(v)}
                        className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVoucher(v.id)}
                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vouchers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No vouchers found.</p>
                <button
                  onClick={openCreateForm}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first voucher
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Edit Voucher" : "Create New Voucher"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === "percentage" ? "Discount Percentage *" : "Discount Amount *"}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={type === "percentage" ? "e.g., 20" : "e.g., 50"}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Min Total */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Purchase Total
                </label>
                <input
                  type="number"
                  value={minTotal}
                  onChange={(e) => setMinTotal(e.target.value)}
                  placeholder="e.g., 100 (optional)"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  {isEditing ? "Update Voucher" : "Create Voucher"}
                </button>
                <button
                  onClick={closeForm}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}