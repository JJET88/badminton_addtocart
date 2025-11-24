// app/dashboard/page.js
"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Today");

  const stats = [
    { title: "Shipped orders", value: "67", bgColor: "bg-gradient-to-br from-blue-400 to-blue-500", icon: "📦" },
    { title: "Pending orders", value: "09", bgColor: "bg-gradient-to-br from-pink-400 to-pink-500", icon: "⏳" },
    { title: "New orders", value: "35", bgColor: "bg-gradient-to-br from-purple-400 to-purple-500", icon: "🆕" },
  ];

  const inboxItems = [
    { text: "Waiting for order#12345", time: "4:39", group: "Support" },
    { text: "Customer support id#22234", time: "11:07", group: "Support" },
  ];

  const recentActivities = [
    { text: "Confirm order update", status: "URGENT", color: "bg-yellow-400", icon: "✓", iconBg: "bg-blue-500" },
    { text: "Finish shipping update", status: "URGENT", color: "bg-yellow-400", icon: "●", iconBg: "bg-red-500" },
    { text: "Create new order", status: "NEW", color: "bg-green-500", icon: "○", iconBg: "bg-gray-300" },
    { text: "Update payment report", status: "DEFAULT", color: "bg-gray-300", icon: "✓", iconBg: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-bold">$ 45,365.00</h1>
            <span className="text-pink-500 flex items-center gap-1">
              <span className="text-sm">▼ $1,294</span>
            </span>
            <span className="text-green-500 flex items-center gap-1">
              <span className="text-sm">▲ $1,294</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-white/90 text-sm font-medium">{stat.title}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-5xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbox Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Inbox</h2>
              <p className="text-xs text-gray-500">Group: Support</p>
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View details
            </button>
          </div>
          
          <div className="space-y-3">
            {inboxItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                <p className="text-gray-700">{item.text}</p>
                <span className="text-gray-500 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Trends Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Today's trends</h2>
              <p className="text-xs text-gray-500">30 Sept 2021</p>
            </div>
            <div className="flex gap-4 text-xs">
              <button 
                onClick={() => setActiveTab("Today")}
                className={`font-medium ${activeTab === "Today" ? "text-blue-600" : "text-gray-400"}`}
              >
                — Today
              </button>
              <button 
                onClick={() => setActiveTab("Yesterday")}
                className={`font-medium ${activeTab === "Yesterday" ? "text-gray-600" : "text-gray-400"}`}
              >
                — Yesterday
              </button>
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          <div className="relative h-48 bg-gradient-to-b from-blue-50 to-transparent rounded-lg">
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <path
                d="M 0,80 Q 50,100 100,70 T 200,30 T 300,60 T 400,40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className={activeTab === "Today" ? "opacity-100" : "opacity-30"}
              />
              <path
                d="M 0,90 Q 50,70 100,90 T 200,50 T 300,30 T 400,70"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                className={activeTab === "Yesterday" ? "opacity-100" : "opacity-30"}
              />
              {activeTab === "Today" && (
                <>
                  <circle cx="300" cy="60" r="4" fill="#3B82F6" />
                  <text x="300" y="45" textAnchor="middle" className="text-xs fill-gray-700">38</text>
                </>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center text-white text-sm`}>
                  {activity.icon}
                </div>
                <p className="text-gray-700">{activity.text}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.color} text-white`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}