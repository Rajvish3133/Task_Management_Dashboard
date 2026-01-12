import React from "react";

export default function AdminStats({ usersCount, tasksCount, pendingCount, completedCount }) {
  const stats = [
    { label: "Users", value: usersCount, bg: "bg-indigo-100", icon: "👥" },
    { label: "Tasks", value: tasksCount, bg: "bg-indigo-100", icon: "📋" },
    { label: "Pending", value: pendingCount, bg: "bg-yellow-50", icon: "⏳" },
    { label: "Completed", value: completedCount, bg: "bg-green-50", icon: "✅" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className={`p-4 rounded-lg shadow ${s.bg} flex items-center justify-between`}>
          <div>
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
          <div className="text-3xl opacity-80">{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
