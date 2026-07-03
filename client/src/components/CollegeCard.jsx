import { MapPin, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatFees, formatLpa } from "../lib/format";
import SavedButton from "./SavedButton";

export default function CollegeCard({ college }) {
  const collegeId = college._id || college.id;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden">
        <img src={college.imageUrl} alt="" className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3">
          <SavedButton collegeId={collegeId} compact />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-950">{college.name}</h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
              <Star size={15} fill="currentColor" />
              {college.rating}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={15} />
            {college.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-slate-500">Fees</p>
            <p className="mt-1 font-bold text-slate-950">{formatFees(college.fees)}</p>
          </div>
          <div className="rounded-md bg-emerald-50 p-3">
            <p className="flex items-center gap-1 text-emerald-700">
              <TrendingUp size={14} />
              Avg package
            </p>
            <p className="mt-1 font-bold text-emerald-900">{formatLpa(college.averagePackage)}</p>
          </div>
        </div>

        <Link
          to={`/colleges/${collegeId}`}
          className="flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
