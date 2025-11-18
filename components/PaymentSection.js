/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useToggle } from "@/app/context/ToggleContext";

const PaymentSection = () => {
  const [selected, setSelected] = useState("kplus");
  const { open, closeSection } = useToggle();

  const paymentMethods = [
    { id: "visa", img: "https://i.pinimg.com/736x/5f/79/a6/5f79a6defe837d721dd2e3b2dba041e1.jpg" },
    { id: "kplus", img: "https://i.pinimg.com/736x/02/8f/b2/028fb2ab4360817776fae93b9dbc7178.jpg" },
    { id: "bbl", img: "https://i.pinimg.com/1200x/8a/c5/4a/8ac54a0d2a234958cf6184d0955b4fda.jpg" },
    { id: "mastercard", img: "https://i.pinimg.com/1200x/19/60/20/1960209695216f804bc94b98b9003825.jpg" },
    { id: "scb", img: "https://i.pinimg.com/736x/21/6b/ba/216bbaef99f93b951bea4f85a1fb7543.jpg" },
    { id: "ktc", img: "https://i.pinimg.com/736x/7a/ef/99/7aef99135a314e0d883346b8bdb22cb3.jpg" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeSection}
      ></div>

      {/* Right Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl p-6 
          transition-transform duration-500 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button
            onClick={closeSection}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">

          {/* Payment Methods */}
          <div>
            <p className="text-lg font-semibold mb-2">Payment Methods</p>
            <div className="grid grid-cols-3 gap-4">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border bg-gray-50 transition
                    ${
                      selected === m.id
                        ? "border-green-500 ring-2 ring-green-300"
                        : "border-transparent hover:border-gray-300"
                    }
                  `}
                >
                  <img src={m.img} alt={m.id} className="h-8 w-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <p className="text-lg font-semibold mb-2">Promo Code</p>
            <div className="flex">
              <input
                type="text"
                placeholder="coupon"
                className="flex-1 border rounded-l-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                Apply
              </button>
            </div>
          </div>

          {/* Confirm Payment */}
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            Confirm Payment
          </button>

          {/* CANCEL Button */}
          <button
            onClick={closeSection}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSection;
