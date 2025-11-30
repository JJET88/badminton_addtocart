import useCartStore from '@/app/store/useCartStore';
import Link from 'next/link'
import React from 'react'
import { CgProfile } from 'react-icons/cg'
import { PiShoppingCart } from 'react-icons/pi'

export default function CartHeader() {
  const { carts } = useCartStore();


  return (
   <header className="bg-blue-800 text-white px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3 text-3xl font-bold">
         <Link href="/">
        <span className="text-4xl">🏸</span> TawBayin
        </Link>
      </div>

     

      {/* Buttons */}
      <div className="flex gap-3">
        
        {/* Cart Button */}
        <Link
          href="/carts"
          className="relative inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-white border hover:border-green-500 transition-all shadow-sm hover:shadow-md"
        >
          <PiShoppingCart className="text-2xl text-black" />

          {/* Badge */}
          <span className="absolute -top-3 -right-2 flex items-center justify-center w-6 h-6 text-[10px] font-bold bg-green-500 text-white rounded-full shadow">
            {carts.length}
          </span>
        </Link>

        {/* Profile Button */}
        {/* <Link href="/login">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <CgProfile className="text-4xl text-black" />
          </div>
        </Link> */}
      </div>
    </header>
  )
}
