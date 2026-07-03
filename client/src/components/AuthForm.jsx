import { GraduationCap, Lock, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      if (isSignup) {
        await signup(name, email, password);
        toast.success("Account created successfully!");
      } else {
        await login(email, password);
        toast.success("Welcome back!");
      }
      navigate("/colleges");
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-md bg-teal-700 text-white">
          <GraduationCap />
        </span>
        <div>
          <h1 className="text-2xl font-black text-slate-950">{isSignup ? "Create account" : "Welcome back"}</h1>
          <p className="text-sm text-slate-500">{isSignup ? "Save your college shortlist" : "Continue your research"}</p>
        </div>
      </div>

      <div className="space-y-4">
        {isSignup && (
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <UserRound size={16} />
              Name
            </span>
            <input name="name" required className="h-11 w-full rounded-md border border-slate-200 px-3 bg-white" />
          </label>
        )}

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Mail size={16} />
            Email
          </span>
          <input name="email" type="email" required className="h-11 w-full rounded-md border border-slate-200 px-3 bg-white" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Lock size={16} />
            Password
          </span>
          <input name="password" type="password" required minLength={6} className="h-11 w-full rounded-md border border-slate-200 px-3 bg-white" />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-11 w-full rounded-md bg-slate-950 px-4 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        {isSignup ? "Already have an account? " : "New to CollegeScout? "}
        <Link to={isSignup ? "/login" : "/signup"} className="font-bold text-teal-700 hover:underline">
          {isSignup ? "Log in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}
