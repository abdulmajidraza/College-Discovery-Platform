import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Award, BookOpen, IndianRupee, MapPin, Star, TrendingUp } from "lucide-react";
import SavedButton from "../components/SavedButton";
import { formatFees, formatLpa } from "../lib/format";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/colleges/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("College not found");
        return res.json();
      })
      .then((data) => {
        setCollege(data);
      })
      .catch((err) => {
        console.error(err);
        navigate("/colleges");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex-1 shell py-20 text-center text-slate-500 font-medium">
        Loading college details...
      </div>
    );
  }

  if (!college) return null;

  return (
    <main className="flex-1">
      <section className="relative min-h-[380px] overflow-hidden bg-slate-950 text-white">
        <img src={college.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="shell relative flex min-h-[380px] flex-col justify-end py-10">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-teal-100">
            <MapPin size={16} />
            {college.location}
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-normal">{college.name}</h1>
              <p className="mt-4 max-w-2xl text-slate-100">{college.overview}</p>
            </div>
            <SavedButton collegeId={college._id || college.id} />
          </div>
        </div>
      </section>

      <section className="shell grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={Star} label="Rating" value={`${college.rating}/5`} />
            <Metric icon={IndianRupee} label="Annual fees" value={formatFees(college.fees)} />
            <Metric icon={TrendingUp} label="Avg package" value={formatLpa(college.averagePackage)} />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Courses</h2>
            <div className="mt-4 grid gap-3">
              {college.courses.map((course, idx) => (
                <div key={course._id || idx} className="flex items-center justify-between rounded-md bg-slate-50 p-4">
                  <p className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen size={17} className="text-teal-700" />
                    {course.name}
                  </p>
                  <span className="text-sm text-slate-500">{course.duration}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Student Reviews</h2>
            <div className="mt-4 grid gap-3">
              {college.reviews.map((review, idx) => (
                <div key={review._id || idx} className="rounded-md border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-950">{review.userName}</p>
                    <span className="text-sm font-bold text-amber-700">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <Award className="text-teal-700" />
            Placement Snapshot
          </h2>
          <p className="mt-3 text-slate-600">{college.placements}</p>
          <dl className="mt-5 space-y-3">
            <Row label="Average package" value={formatLpa(college.averagePackage)} />
            <Row label="Highest package" value={formatLpa(college.highestPackage)} />
            <Row label="Category" value={college.category} />
          </dl>
        </aside>
      </section>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="text-teal-700" size={22} />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-bold text-slate-950">{value}</dd>
    </div>
  );
}
