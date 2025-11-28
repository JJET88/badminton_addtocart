"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // FIXED: matched your real DB structure
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch user (id=1 for now)
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users/1"); // ⬅ change later for auth
      const data = await res.json();
      setUser({
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setLoading(false);
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Save user updates
  const handleSave = async () => {
    const res = await fetch("/api/users/1", {
      method: "PUT",
      body: JSON.stringify(user),
    });
    alert(res.ok ? "Profile updated successfully!" : "Failed to update profile");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: "profile", name: "Profile", icon: "👤" },
          { id: "account", name: "Account", icon: "⚙️" },
          { id: "notifications", name: "Notifications", icon: "🔔" },
          { id: "security", name: "Security", icon: "🔒" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Profile Information</h2>

          <InputField
            label="Name"
            value={user.name}
            onChange={(v) => setUser({ ...user, name: v })}
          />

          <InputField
            label="Email"
            type="email"
            value={user.email}
            onChange={(v) => setUser({ ...user, email: v })}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>

          <p className="text-gray-600 mb-4">
            Account management features can be added here (store name, currency, etc.)
          </p>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Notifications</h2>

          <ToggleItem label="New order notifications" />
          <ToggleItem label="Low stock alerts" />
          <ToggleItem label="Daily sales summary" />
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Security</h2>

          <PasswordChangeForm />
        </div>
      )}
    </div>
  );
}

/* ----------- REUSABLE COMPONENTS ----------- */

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  );
}

function ToggleItem({ label }) {
  return (
    <div className="flex items-center justify-between py-3 border-b">
      <p>{label}</p>
      <input type="checkbox" defaultChecked className="w-5 h-5" />
    </div>
  );
}

function PasswordChangeForm() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handlePasswordChange = async () => {
    setError("");

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("All fields are required");
      return;
    }

    if (passwords.new.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/users/1/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <InputField
        label="Current Password"
        type="password"
        value={passwords.current}
        onChange={(v) => setPasswords({ ...passwords, current: v })}
      />
      <InputField
        label="New Password"
        type="password"
        value={passwords.new}
        onChange={(v) => setPasswords({ ...passwords, new: v })}
      />
      <InputField
        label="Confirm New Password"
        type="password"
        value={passwords.confirm}
        onChange={(v) => setPasswords({ ...passwords, confirm: v })}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        onClick={handlePasswordChange}
      >
        Update Password
      </button>
    </div>
  );
}