import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  const initials = (user?.name || "").split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">TD</div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Task Dashboard</h1>
          <div className="text-xs text-gray-500">Manage your tasks with ease</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <button onClick={() => navigate('/admin')} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-700 hover:text-white transition">
            Admin
          </button>
        )}

        <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-white border rounded-full">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">{initials}</div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-gray-800">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="ml-2 px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-red-500 hover:text-white text-sm transition">Logout</button>
      </div>
    </nav>
  );
}
