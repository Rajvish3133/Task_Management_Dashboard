import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(loginUser(data));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return ( 
    
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm">
          <span className="text-gray-600">Email</span>
          <div className="mt-1 relative">
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <svg className="w-5 h-5 absolute right-3 top-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8.5L12 13L21 8.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#CBD5E1" strokeWidth="1.5" />
            </svg>
          </div>
        </label>

        <label className="block text-sm">
          <span className="text-gray-600">Password</span>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-2.5 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <div className="flex items-center text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="w-4 h-4" /> Remember me
          </label>
        </div>

        <button
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium">Register</Link>
        </p>
      </form>
    </AuthCard>
  );
}
