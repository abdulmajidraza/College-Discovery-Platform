import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSaved } from "../context/SavedContext";

export default function SavedButton({ collegeId, compact = false }) {
  const { savedIds, toggleSave } = useSaved();
  const [loading, setLoading] = useState(false);

  const saved = savedIds.includes(collegeId);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      const isNowSaved = await toggleSave(collegeId);
      toast.success(isNowSaved ? "College saved" : "Removed from saved colleges");
    } catch (error) {
      toast.error(error.message || "Failed to update saved college");
    } finally {
      setLoading(false);
    }
  }

  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 disabled:opacity-50 cursor-pointer ${
        compact ? "size-10" : "px-4 py-2"
      }`}
      aria-label={saved ? "Remove saved college" : "Save college"}
      title={saved ? "Remove saved college" : "Save college"}
    >
      <Icon size={18} className={saved ? "text-teal-700" : ""} />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
