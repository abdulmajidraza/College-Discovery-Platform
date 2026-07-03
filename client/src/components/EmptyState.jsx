import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <SearchX className="mx-auto text-slate-400" size={36} />
      <h3 className="mt-4 text-lg font-bold text-slate-950">No colleges found</h3>
      <p className="mt-2 text-sm text-slate-500">Try changing the search term, location, or sorting option.</p>
    </div>
  );
}
