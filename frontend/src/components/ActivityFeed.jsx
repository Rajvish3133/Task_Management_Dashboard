import React from 'react';

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActivityFeed({ tasks = [], limit = 6 }) {
  const events = [];

  tasks.forEach((t) => {
    if (t.createdAt) {
      events.push({ type: 'created', title: t.title, date: t.createdAt });
    }
    if (t.status === 'completed' && t.updatedAt) {
      events.push({ type: 'completed', title: t.title, date: t.updatedAt });
    }
  });

  events.sort((a, b) => new Date(b.date) - new Date(a.date));

  const slice = events.slice(0, limit);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Activity</div>
        <div className="text-xs text-gray-400">Recent</div>
      </div>

      <ul className="space-y-2">
        {slice.length === 0 && <div className="text-sm text-gray-500">No recent activity</div>}
        {slice.map((e, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1 ${e.type === 'created' ? 'bg-indigo-600' : 'bg-green-600'}`} />
            <div>
              <div className="text-sm text-gray-700">{e.type === 'created' ? 'Created' : 'Completed'} <span className="font-medium">{e.title}</span></div>
              <div className="text-xs text-gray-400">{timeAgo(e.date)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
