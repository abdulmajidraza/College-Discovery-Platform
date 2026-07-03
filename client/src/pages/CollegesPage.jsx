import { useEffect, useMemo, useState } from "react";
import CollegeCard from "../components/CollegeCard";
import EmptyState from "../components/EmptyState";
import FilterBar from "../components/FilterBar";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function CollegesPage() {
  const [colleges, setColleges] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [sort, setSort] = useState("rating");

  const query = useMemo(() => {
    const params = new URLSearchParams({ search, location, sort });
    return params.toString();
  }, [search, location, sort]);

  useEffect(() => {
    let active = true;
    fetch(`/api/colleges?${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (active) setColleges(data);
      })
      .catch((err) => {
        console.error("Error loading colleges:", err);
        if (active) setColleges([]);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="shell">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Discover</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">College Listing</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Search by college name or location, filter the city, and sort by rating, fees, or placement outcome.
          </p>
        </div>
      </section>

      <section className="shell space-y-6 py-8">
        <FilterBar
          search={search}
          location={location}
          sort={sort}
          onSearch={setSearch}
          onLocation={setLocation}
          onSort={setSort}
        />

        {!colleges ? (
          <LoadingSkeleton />
        ) : colleges.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard key={college._id} college={college} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}
