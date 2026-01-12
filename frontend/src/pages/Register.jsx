import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import { getProfile } from "../redux/slices/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      toast.success("Registration successful");

      try {
        await dispatch(getProfile()).unwrap();
      } catch (e) {
        
        console.error('Profile fetch failed after register', e);
        navigate("/login");
        return;
      }

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Start managing tasks with ease">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="text-gray-600">Full name</span>
          <input
            name="name"
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-600">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-600">Password</span>
          <div className="mt-1 relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-2.5 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <div className="text-sm">
          <label className=" text-gray-600">
              <span className="text-gray-500">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="px-3  mt-1 w-full py-2 border rounded-md focus:outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              
            </select>
          </label>
        </div>

        <button
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}
