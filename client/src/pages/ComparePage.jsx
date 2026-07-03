import { useEffect, useState } from "react";
import { formatFees, formatLpa } from "../lib/format";

export default function ComparePage() {
  const [colleges, setColleges] = useState([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/colleges")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setColleges(data);
          setLeft(data[0]._id);
          setRight(data[1] ? data[1]._id : data[0]._id);
        }
      })
      .catch((err) => console.error("Error loading colleges for comparison:", err))
      .finally(() => setLoading(false));
  }, []);

  const first = colleges.find((college) => college._id === left) ?? colleges[0];
  const second = colleges.find((college) => college._id === right) ?? colleges[1] ?? colleges[0];

  if (loading || !first) {
    return (
      <div className="flex-1 shell py-20 text-center text-slate-500 font-medium">
        Loading colleges for comparison...
      </div>
    );
  }

  return (
    <main className="flex-1">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="shell">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Compare</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">College Comparison</h1>
        </div>
      </section>

      <section className="shell space-y-5 py-8">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <select value={left} onChange={(event) => setLeft(event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 bg-white">
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
          <select value={right} onChange={(event) => setRight(event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 bg-white">
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <CompareRow label="College" left={first.name} right={second.name} strong />
          <CompareRow label="Location" left={first.location} right={second.location} />
          <CompareRow label="Rating" left={`${first.rating}/5`} right={`${second.rating}/5`} />
          <CompareRow label="Fees" left={formatFees(first.fees)} right={formatFees(second.fees)} />
          <CompareRow label="Average package" left={formatLpa(first.averagePackage)} right={formatLpa(second.averagePackage)} />
          <CompareRow label="Highest package" left={formatLpa(first.highestPackage)} right={formatLpa(second.highestPackage)} />
        </div>
      </section>
    </main>
  );
}

function CompareRow({ label, left, right, strong = false }) {
  return (
    <div className="grid grid-cols-[120px_1fr_1fr] border-b border-slate-100 last:border-0">
      <div className="bg-slate-50 p-4 text-sm font-bold text-slate-600">{label}</div>
      <div className={`p-4 ${strong ? "font-black text-slate-950" : "text-slate-700"}`}>{left}</div>
      <div className={`p-4 ${strong ? "font-black text-slate-950" : "text-slate-700"}`}>{right}</div>
    </div>
  );
}
