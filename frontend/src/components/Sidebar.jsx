import React from "react";
import ActivityFeed from "./ActivityFeed";

export default function Sidebar({
  users,
  tasks,
  query,
  setQuery,
  filter,
  setFilter,
  sortBy,
  setSortBy,
  selectedCount,
  onMarkComplete,
  onDeleteSelected,
  exportCSV,
  onClose,
}) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <aside className="w-72 shrink-0 bg-white rounded-lg p-4 shadow hidden md:block md:-ml-12">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Overview</h3>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="font-bold text-indigo-700">{total}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="font-bold text-yellow-600">{pending}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Done</div>
            <div className="font-bold text-green-600">{completed}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Filter</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            All
          </button>
          <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700'}`}>
            Pending
          </button>
          <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}>
            Completed
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Sort</div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>


      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Quick actions</div>
        <div className="flex flex-col gap-2">
          <button onClick={onMarkComplete} disabled={selectedCount===0} className="px-3 py-2 rounded bg-green-200 text-green-800 border border-green-300 hover:bg-green-300 transition disabled:opacity-60">Mark selected complete</button>
          <button onClick={onDeleteSelected} disabled={selectedCount===0} className="px-3 py-2 rounded bg-red-200 text-red-800 border border-red-300 hover:bg-red-300 transition disabled:opacity-60">Delete selected</button>
          <button onClick={exportCSV} className="px-3 py-2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 transition">Export CSV</button>
        </div>
      </div>

      <div className="text-sm text-gray-500">Selected: <span className="ml-1 inline-block px-2 py-0.5 bg-gray-200 rounded text-gray-800 font-medium">{selectedCount}</span></div>

      <ActivityFeed tasks={tasks} />

      <div className="hidden md:block text-xs mt-4 text-gray-400">Tip: Use the buttons to filter and export tasks.</div>
    </aside>
  );
}
