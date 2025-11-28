"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SaleDetail() {
  const params = useParams();
  const id = params?.id;

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSale() {
    if (!id) return;

    try {
      const res = await fetch(`/api/sales/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch sale");
      }

      const data = await res.json();

      // Support API returning array OR object
      const saleData = Array.isArray(data) ? data[0] : data;

      setSale(saleData || null);
    } catch (err) {
      console.error("Failed to load sale:", err);
      setSale(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSale();
  }, [id]);

  function printInvoice() {
    window.print();
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!sale) return <p className="p-6">Sale not found.</p>;

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Invoice #{sale.id}</h1>

        <button
          onClick={printInvoice}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Print Invoice
        </button>
      </div>

      {/* INVOICE CARD */}
      <div className="border rounded-2xl shadow-md p-6 max-w-2xl bg-white">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Sale Details</h2>
          <p className="text-gray-600">
            Date:{" "}
            
              {new Date(sale.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Subtotal:</span> ฿ {sale.subtotal ?? 0}
          </p>

          <p>
            <span className="font-semibold">Tax:</span> ฿ {sale.tax ?? 0}
          </p>

          {sale.voucherCode && (
            <p>
              <span className="font-semibold">Voucher Applied:</span>{" "}
              {sale.voucherCode}
            </p>
          )}

          <p>
            <span className="font-semibold">Payment Type:</span>{" "}
            {sale.paymentType || "N/A"}
          </p>

          <p>
            <span className="font-semibold">Cashier ID:</span>{" "}
            {sale.cashierId || "N/A"}
          </p>

          <hr className="my-4" />

          <p className="text-xl font-bold">Total: ฿ {sale.total ?? 0}</p>
        </div>
      </div>

      {/* PRINT STYLE */}
      <style jsx global>{`
        @media print {
          button {
            display: none;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
