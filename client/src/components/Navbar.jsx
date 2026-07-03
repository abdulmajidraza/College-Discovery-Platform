import { BookmarkCheck, GraduationCap, Search, UserRound, LogOut, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid size-9 place-items-center rounded-md bg-teal-700 text-white">
            <GraduationCap size={20} />
          </span>
          CollegeScout
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/colleges"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Search size={17} />
            <span className="hidden sm:inline">Colleges</span>
          </Link>
          <Link
            to="/compare"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <BarChart3 size={17} />
            <span className="hidden sm:inline">Compare</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <BookmarkCheck size={17} />
            <span className="hidden sm:inline">Saved</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <BarChart3 size={17} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 border-l border-slate-200 pl-1 sm:pl-2 ml-1">
              <span className="text-sm font-bold text-slate-800 hidden md:inline">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 rounded-md px-2 sm:px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                title="Logout"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <UserRound size={17} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
