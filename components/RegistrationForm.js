/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React from "react";

const RegistrationForm = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-[380px]">

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-8">Create an account</h1>

        {/* Input Group */}
        <form>

        
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="eg. John Doe"
              className="
                w-full px-4 py-3
                bg-gray-100 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Your email</label>
            <input
              type="email"
              required
              placeholder="eg. john@company.com"
              className="
                w-full px-4 py-3
                bg-gray-100 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="
                w-full px-4 py-3
                bg-gray-100 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              type="password"
              required
              className="
                w-full px-4 py-3
                bg-gray-100 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">
              I accept the{" "}
              <span className="text-blue-600 cursor-pointer">Terms and Conditions</span>
            </span>
          </div>
        </div>

        {/* Button */}
        <Link href="/login">
       
        <button
        
          className="
            w-full mt-6 py-3
            bg-blue-600 text-white
            rounded-lg
            hover:bg-blue-700
            transition
          "
        >
          Create an account
        </button>
         </Link>
</form>
        {/* Footer Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login">
          <span className="text-blue-600 cursor-pointer">Login here</span>
          </a>
        </p>

      </div>
    </div>
  );
};

export default RegistrationForm;
