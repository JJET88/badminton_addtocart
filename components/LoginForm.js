/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

export default function LoginForm() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-[380px]">

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-8">Sign in to your account</h1>

        {/* Input Fields */}
        <form>
        <div className="space-y-5">

          {/* Email */}
          

          
          <div>
            <label className="block text-sm font-medium mb-1">Your email</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
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

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm mt-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Remember me</span>
            </div>

            <span className="text-blue-600 cursor-pointer">
              Forgot password?
            </span>
          </div>
        </div>
        

        {/* Sign In Button */}
        <Link href={'/products'} >
        <button
          className="
            w-full mt-8 py-3
            bg-blue-600 text-white
            rounded-lg
            hover:bg-blue-700
            transition
          "
        >
          Sign in
        </button>
        </Link>
</form>
        {/* Footer — Sign up link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account yet?{" "}
          <a href="/register">

          <span className="text-blue-600 cursor-pointer">Sign up</span>
          </a>
        </p>

      </div>
    </div>
  );
}
