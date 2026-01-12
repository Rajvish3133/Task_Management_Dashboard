import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../redux/slices/taskSlice";
import TaskCard from "../components/TaskCard";
import TaskStats from "../components/TaskStats";
import EditTaskModal from "../components/EditTaskModal";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

export default function Dashboard() {
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.task.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const [viewMode, setViewMode] = useState("grid"); 

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const addTask = () => {
    if (!title.trim()) return toast.error("Title required");

    dispatch(createTask({ title, description }));
    setTitle("");
    setDescription("");
    toast.success("Task added");
  };

  const toggleStatus = (task) => {
    dispatch(
      updateTask({
        id: task._id,
        data: {
          status:
            task.status === "pending"
              ? "completed"
              : "pending",
        },
      })
    );
  };

  
  const applyFiltersAndSort = (tasksList, filterStatus, query, sortKey) => {
    let list = [...tasksList];

    if (filterStatus !== "all") list = list.filter((t) => t.status === filterStatus);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
      );
    }

    if (sortKey === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortKey === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return list;
  };

  const filteredTasks = useMemo(() => applyFiltersAndSort(tasks, filter, searchQuery, sortBy), [tasks, filter, searchQuery, sortBy]);

  
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const markSelectedComplete = () => {
    selected.forEach((id) => {
      const task = tasks.find((t) => t._id === id);
      if (task && task.status !== "completed") {
        dispatch(updateTask({ id, data: { status: "completed" } }));
      }
    });
    setSelected([]);
    toast.success("Marked selected tasks as completed");
  };

  const deleteSelected = () => {
    selected.forEach((id) => dispatch(deleteTask(id)));
    setSelected([]);
    toast.success("Deleted selected tasks");
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  };

  const saveEdit = async (data) => {
    await dispatch(updateTask({ id: editingTask._id, data }));
    setIsEditOpen(false);
    setEditingTask(null);
    toast.success("Task updated");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-6">
        <Sidebar
          tasks={tasks}
          query={searchQuery}
          setQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCount={selected.length}
          onMarkComplete={markSelectedComplete}
          onDeleteSelected={deleteSelected}
          exportCSV={() => {
            
            const rows = ["Title,Description,Status,Created At"];
            const list = [...tasks]
              .filter((t) => filter === 'all' ? true : t.status === filter)
              .filter((t) => searchQuery.trim() ? (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.description||'').toLowerCase().includes(searchQuery.toLowerCase())) : true);
            list.forEach((t) => rows.push(`"${t.title.replace(/"/g,'""')}","${(t.description||'').replace(/"/g,'""')}",${t.status},"${new Date(t.createdAt).toLocaleString()}"`));
            const csv = rows.join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasks_export_${new Date().toISOString()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">My Tasks</h1>

            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="px-3 py-1 rounded bg-indigo-600 text-white">{viewMode === 'grid' ? 'List' : 'Grid'}</button>
              <button onClick={() => setMobileFiltersOpen(true)} className="px-3 py-1 rounded border">Filters</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="input col-span-2"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex gap-3">
                <input
                  className="input flex-1"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={addTask} className="btn bg-indigo-600 text-white px-4">
                  Add
                </button>
              </div>
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)}></div>

              <div className="relative w-full max-w-sm bg-white rounded-lg shadow p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Filters</h4>
                  <button onClick={() => setMobileFiltersOpen(false)} className="px-2 py-1 rounded border">Close</button>
                </div>

                <div className="mb-3">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">Filter</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setFilter('all'); setMobileFiltersOpen(false); }} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>All</button>
                    <button onClick={() => { setFilter('pending'); setMobileFiltersOpen(false); }} className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700'}`}>Pending</button>
                    <button onClick={() => { setFilter('completed'); setMobileFiltersOpen(false); }} className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}>Completed</button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">Sort</div>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => { markSelectedComplete(); setMobileFiltersOpen(false); }} disabled={selected.length===0} className="px-3 py-2 rounded bg-green-200 text-green-800 border border-green-300 hover:bg-green-300 disabled:opacity-60">Mark selected complete</button>
                  <button onClick={() => { deleteSelected(); setMobileFiltersOpen(false); }} disabled={selected.length===0} className="px-3 py-2 rounded bg-red-200 text-red-800 border border-red-300 hover:bg-red-300 disabled:opacity-60">Delete selected</button>
                </div>
              </div>
            </div>
          )}

      <div className="md:hidden flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-2 rounded shadow gap-2 flex-1">
            <input
              placeholder="Search tasks..."
              className="px-3 py-1 outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 border rounded">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded ${filter === "pending" ? "bg-yellow-400 text-white" : "bg-white text-gray-700"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded ${filter === "completed" ? "bg-green-500 text-white" : "bg-white text-gray-700"}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Selected: <span className="ml-1 inline-block px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">{selected.length}</span></div>
          <button
            onClick={markSelectedComplete}
            disabled={selected.length === 0}
            className="px-3 py-1 rounded bg-green-200 text-green-800 border border-green-300 hover:bg-green-300 disabled:opacity-60"
          >
            Mark Complete
          </button>
          <button
            onClick={deleteSelected}
            disabled={selected.length === 0}
            className="px-3 py-1 rounded bg-red-200 text-red-800 border border-red-300 hover:bg-red-300 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-3">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              selected={selected.includes(task._id)}
              onSelect={() => toggleSelect(task._id)}
              onDelete={(id) => dispatch(deleteTask(id))}
              onToggle={toggleStatus}
              onEdit={() => openEdit(task)}
            />
          ))}
        </div>
      </div>

      <EditTaskModal open={isEditOpen} onClose={() => setIsEditOpen(false)} task={editingTask} onSave={saveEdit} />
        </div>
      </div>
    </div>
  );
}
