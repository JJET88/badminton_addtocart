/* eslint-disable @next/next/no-img-element */
"use client";
import useCartStore from "@/app/store/useCartStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProductDetails({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { carts, addCart } = useCartStore();

   

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    // ✅ Fetch product from your Next.js API
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );

  if (error || !product)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">❌ Product not found.</p>
      </div>
    );

  const renderStars = (rate) => {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  
	};
    const handleAddedBtn = (event) => {
		event.stopPropagation();
		showToast("Item is already in My Cart","error");
	};

	const handleAddCartBtn = (event, productId) => {
		event.stopPropagation();
		const newCart = {
			id: Date.now(),
			productId: productId,
			quantity: 1,
		};
		addCart(newCart);

    return (
      <div className="flex items-center gap-1">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400">★</span>
          ))}
        {halfStar && <span className="text-yellow-400">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
        <span className="text-gray-600 ml-2 text-sm">
          ({product.rating_count || 0} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            🛍️ Product Details
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.image || "/default-image.png"}
              alt={product.title}
              className="w-full max-w-sm h-auto rounded-2xl shadow-md object-cover transform hover:scale-105 transition duration-300"
              onError={(e) => (e.currentTarget.src = "/default-image.png")}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-5">
            <h2 className="text-3xl font-semibold text-gray-800">{product.title}</h2>

            <p className="text-gray-500 italic text-sm">
              Category:{" "}
              <span className="text-blue-600 font-medium">
                {product.category || "Uncategorized"}
              </span>
            </p>

            {renderStars(product.rating_rate || 0)}

            <p className="text-gray-700 leading-relaxed text-base">
              {product.description || "No description available."}
            </p>

            <div className="mt-2">
              <span className="text-2xl font-bold text-blue-700">
                💵 ${product.price}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
            
                <button
                // onClick={() => window.history.back()}
                className="flex-1 min-w-[120px] px-3 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md font-medium"
              >
                <Link href={`/products`}>← Back</Link>
                
              </button>
               <button
                // onClick={() => window.history.back()}
                className="flex-1 min-w-[120px] px-3 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md font-medium"
              >
                <a href={`/products/${id}/edit`}> ✏️ Edit</a>
                
              </button>
             

              {/* <button
                onClick={() => alert("🛒 Added to cart!")}
                className="flex-1 min-w-[120px] px-3 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md font-medium"
              >
                🛒 Add to Cart
              </button> */}
              {carts.find((cart) => cart.productId === id) ? (
									<button
										onClick={(e) => handleAddedBtn(e)}
										className=" text-sm border px-3 py-3 text-white rounded-xl bg-blue-900"
									>
										Added
									</button>
								) : (
									<button
										onClick={(e) => handleAddCartBtn(e, id)}
										className=" text-sm border  px-3 py-3 text-white rounded-xl bg-blue-600"
									>
										Add Cart
									</button>
								)}
             
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-center text-sm text-gray-500">
          Product ID: {product.id}
        </div>
      </div>
    </div>
  );
}
