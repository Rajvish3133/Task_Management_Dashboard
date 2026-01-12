import React, { useState, useEffect } from "react";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    }
  }, [task]);

  if (!open) return null;

  const save = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSave({ title: title.trim(), description: description.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10 p-6 transform transition-all">
        <h3 className="text-lg font-semibold mb-3">Edit Task</h3>

        <label className="block text-sm mb-2">
          <span className="text-gray-600">Title</span>
          <input
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block text-sm mb-4">
          <span className="text-gray-600">Description</span>
          <textarea
            rows={4}
            className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
