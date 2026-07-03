import { SlidersHorizontal } from "lucide-react";

const locations = ["All", "Delhi", "Mumbai", "Tamil Nadu", "Rajasthan", "Hyderabad"];

export default function FilterBar({
  search,
  location,
  sort,
  onSearch,
  onLocation,
  onSort,
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search by college, location, or stream"
        className="h-11 rounded-md border border-slate-200 px-4 text-sm text-slate-900"
      />

      <select
        value={location}
        onChange={(event) => onLocation(event.target.value)}
        className="h-11 rounded-md border border-slate-200 px-3 text-sm text-slate-900"
      >
        {locations.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <label className="relative">
        <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 text-slate-400" size={17} />
        <select
          value={sort}
          onChange={(event) => onSort(event.target.value)}
          className="h-11 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm text-slate-900"
        >
          <option value="rating">Best rating</option>
          <option value="fees">Lowest fees</option>
          <option value="package">Highest package</option>
        </select>
      </label>
    </div>
  );
}
