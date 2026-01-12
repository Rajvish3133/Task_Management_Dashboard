import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import AdminStats from "../components/AdminStats";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("users"); 
  const [filterStatus, setFilterStatus] = useState("all");

  const [usersPage, setUsersPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const pageSize = 8;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Unable to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await api.get("/admin/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Unable to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const usersCount = users.length;
  const tasksCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const filteredUsers = useMemo(() => {
    let list = users;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [users, query]);

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (filterStatus !== "all") list = list.filter((t) => t.status === filterStatus);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q) || (t.user?.name || "").toLowerCase().includes(q));
    }
    return list;
  }, [tasks, query, filterStatus]);

  const pagedUsers = filteredUsers.slice(0, usersPage * pageSize);
  const pagedTasks = filteredTasks.slice(0, tasksPage * pageSize);

  const confirm = ({ title, message, onConfirm }) => {
    setConfirmPayload({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  const handleChangeRole = (u, role) => {
    confirm({
      title: "Change role",
      message: `Change role of ${u.name} to ${role}?`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await api.put(`/admin/users/${u._id}/role`, { role });
          toast.success("Role updated");
          fetchUsers();
        } catch (err) {
          toast.error("Unable to update role");
        } finally {
          setConfirmLoading(false);
          setConfirmOpen(false);
        }
      },
    });
  };

  const handleDeleteTask = (t) => {
    confirm({
      title: "Delete task",
      message: `Delete task '${t.title}' permanently?`,
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await api.delete(`/admin/task/${t._id}`);
          toast.success("Task deleted");
          fetchTasks();
        } catch (err) {
          toast.error("Unable to delete task");
        } finally {
          setConfirmLoading(false);
          setConfirmOpen(false);
        }
      },
    });
  };

  const exportTasksCSV = () => {
    const rows = ["Title,Description,Status,Owner,Owner Email,Created At"];
    tasks.forEach((t) => {
      const line = [`"${t.title.replace(/"/g, '""')}","${(t.description || "").replace(/"/g, '""')}",${t.status},"${t.user?.name || ""}","${t.user?.email || ""}","${new Date(t.createdAt).toLocaleString()}"`];
      rows.push(line);
    });

    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <AdminStats usersCount={usersCount} tasksCount={tasksCount} pendingCount={pendingCount} completedCount={completedCount} />

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-white p-2 rounded shadow flex items-center gap-2 flex-1">
              <input placeholder={tab === 'users' ? 'Search users by name or email...' : 'Search tasks by title, owner, or description...'} className="outline-none w-full px-2" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setTab('users')} className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Users</button>
              <button onClick={() => setTab('tasks')} className={`px-3 py-1 rounded ${tab === 'tasks' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Tasks</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {tab === 'tasks' && (
              <>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1 border rounded">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={exportTasksCSV} className="px-3 py-1 rounded bg-indigo-600 text-white">Export CSV</button>
              </>
            )}
            <div className="text-sm text-gray-600">{tab === 'users' ? `${filteredUsers.length} users` : `${filteredTasks.length} tasks`}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tab === 'users' ? (
          <div className="bg-white p-4 rounded-lg shadow">
            {loadingUsers ? (
              <div>Loading users...</div>
            ) : (
              <div className="space-y-3">
                {pagedUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between gap-3 p-3 border rounded">
                    <div>
                      <div className="font-medium">{u.name} <span className="text-xs text-gray-400">({u.email})</span></div>
                      <div className="text-sm text-gray-500">Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-sm ${u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{u.role}</div>
                      <select value={u.role} onChange={(e) => handleChangeRole(u, e.target.value)} className="px-2 py-1 border rounded">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))}

                {pagedUsers.length < filteredUsers.length && (
                  <div className="text-center">
                    <button onClick={() => setUsersPage((p) => p + 1)} className="px-4 py-2 rounded bg-indigo-600 text-white">Load more</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            {loadingTasks ? (
              <div>Loading tasks...</div>
            ) : (
              <div className="space-y-3">
                {pagedTasks.map((t) => (
                  <div key={t._id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                      <div className="text-xs text-gray-400 mt-1">By: {t.user?.name} ({t.user?.email})</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`text-sm ${t.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{t.status}</div>
                      <button onClick={() => handleDeleteTask(t)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </div>
                ))}

                {pagedTasks.length < filteredTasks.length && (
                  <div className="text-center">
                    <button onClick={() => setTasksPage((p) => p + 1)} className="px-4 py-2 rounded bg-indigo-600 text-white">Load more</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal open={confirmOpen} title={confirmPayload.title} message={confirmPayload.message} onConfirm={confirmPayload.onConfirm} onCancel={() => setConfirmOpen(false)} loading={confirmLoading} />
    </div>
  );
}
