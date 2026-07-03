import { BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import CollegeCard from "../components/CollegeCard";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [savedColleges, setSavedColleges] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      fetch("/api/saved")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSavedColleges(data);
          } else {
            setSavedColleges([]);
          }
        })
        .catch((err) => {
          console.error(err);
          setSavedColleges([]);
        })
        .finally(() => setLoading(false));
    } else {
      const localIds = JSON.parse(localStorage.getItem("savedColleges") || "[]");
      if (localIds.length === 0) {
        setSavedColleges([]);
        setLoading(false);
        return;
      }

      fetch("/api/colleges")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const filtered = data.filter((c) => localIds.includes(c._id || c.id));
            setSavedColleges(filtered);
          } else {
            setSavedColleges([]);
          }
        })
        .catch((err) => {
          console.error(err);
          setSavedColleges([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  const isLoading = authLoading || loading;

  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="shell">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-teal-700">
            <BookmarkCheck size={17} />
            Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">My Saved Colleges</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Your shortlist is synchronized with your database account when logged in, or saved in local storage for guest browsing.
          </p>
        </div>
      </section>

      <section className="shell py-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : savedColleges && savedColleges.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map((college) => (
              <CollegeCard key={college._id || college.id} college={college} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
