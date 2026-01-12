import React from "react";

export default function TaskStats({ total, pending, completed }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div className="p-4 rounded-lg bg-linear-to-r from-gray-100 to-white shadow flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="text-3xl text-gray-300">📋</div>
      </div>

      <div className="p-4 rounded-lg bg-linear-to-r from-yellow-50 to-white shadow flex items-center justify-between">
        <div>
          <div className="text-sm text-yellow-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">{pending}</div>
        </div>
        <div className="text-3xl">⏳</div>
      </div>

      <div className="p-4 rounded-lg bg-linear-to-r from-green-50 to-white shadow flex items-center justify-between">
        <div>
          <div className="text-sm text-green-600">Completed</div>
          <div className="text-2xl font-bold text-green-800">{completed}</div>
        </div>
        <div className="text-3xl">✅</div>
      </div>
    </div>
  );
}
