"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/app/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import LogoutBtn from "./LogoutBtn";

export default function UserProfile() {
  const params = useParams();
  const userId = params.id; // Get userId from URL params
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateAuthUser = useAuthStore((s) => s.updateUser);
  const authUser = useAuthStore((s) => s.user);

  const router = useRouter();

  // Fetch user on mount
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      const data = await res.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err) {
      toast.error(err.message || 'Failed to load user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      const updateData = {
        name,
        email,
        role: user.role
      };

      // Only include password if it's not empty
      if (password && password.trim() !== "") {
        updateData.password = password;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error);
      }
      
      const updatedUser = await res.json();
      setUser(updatedUser);
      
      // Update auth store only if updating own profile
      if (authUser?.id == userId) { // Use == for type coercion
        updateAuthUser({ name: updatedUser.name, email: updatedUser.email });
      }
      
      setPassword(""); // Clear password field
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Update failed');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
      router.push("/");
    
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            User Profile
          </h2>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="mb-5">
            <label className="block text-gray-900 font-medium mb-2">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-900 font-medium mb-2">
              Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-2">
              New Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            {password && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div className="flex gap-3 items-center justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-white font-medium py-3 px-6 rounded-lg"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Updating...
                </span>
              ) : 'Update Profile'}
            </button>
            <LogoutBtn />
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Role:</span>{" "}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium text-gray-900">Member since:</span>{" "}
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
