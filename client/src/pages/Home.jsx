import { ArrowRight, BarChart3, BookmarkCheck, Search, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CollegeCard from "../components/CollegeCard";

const stats = [
  { label: "Curated colleges", value: "500+", icon: Search },
  { label: "Student reviews", value: "50k+", icon: Star },
  { label: "Placement records", value: "1k+", icon: BarChart3 },
];

export default function Home() {
  const [topColleges, setTopColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/colleges?sort=rating")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTopColleges(data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Error loading top colleges:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1">
      <section className="relative min-h-[560px] overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-slate-950/40" />

        <div className="shell relative grid min-h-[560px] content-center gap-8 py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
              <ShieldCheck size={16} />
              Admissions research, simplified
            </span>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-normal sm:text-6xl">
              Find Your Dream College
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Search colleges, compare fees and placements, inspect courses, and save your shortlist in one clean dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/colleges"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-600 px-5 font-bold text-white transition hover:bg-teal-500"
              >
                Explore Colleges
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/compare"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Compare Colleges
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur">
                  <Icon size={20} />
                  <p className="mt-3 text-3xl font-black">{stat.value}</p>
                  <p className="text-sm text-slate-200">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Top rated</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Colleges reviewers notice first</h2>
          </div>
          <Link to="/dashboard" className="hidden items-center gap-2 text-sm font-bold text-teal-700 sm:flex">
            <BookmarkCheck size={17} />
            Saved dashboard
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse bg-slate-200 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topColleges.map((college) => (
              <CollegeCard key={college._id} college={college} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
