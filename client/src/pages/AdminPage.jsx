import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    category: '',
    fees: '',
    rating: '',
    averagePackage: '',
    highestPackage: '',
    overview: '',
    placements: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) return;

    fetch('/api/admin/colleges', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then((data) => setColleges(data))
      .catch((err) => {
        console.error(err);
        toast.error(err.message || 'Unable to load colleges');
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (college) => {
    setEditing(college);
    setForm({
      name: college.name || '',
      location: college.location || '',
      category: college.category || '',
      fees: college.fees || '',
      rating: college.rating || '',
      averagePackage: college.averagePackage || '',
      highestPackage: college.highestPackage || '',
      overview: college.overview || '',
      placements: college.placements || '',
      imageUrl: college.imageUrl || ''
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      location: '',
      category: '',
      fees: '',
      rating: '',
      averagePackage: '',
      highestPackage: '',
      overview: '',
      placements: '',
      imageUrl: ''
    });
  };

  const saveCollege = async (event) => {
    event.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/admin/colleges/${editing._id || editing.id}` : '/api/admin/colleges';
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fees: Number(form.fees),
          rating: Number(form.rating),
          averagePackage: Number(form.averagePackage),
          highestPackage: Number(form.highestPackage)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Save failed');
      }

      const saved = await res.json();
      if (editing) {
        setColleges((prev) => prev.map((item) => (item._id === saved._id || item.id === saved._id ? saved : item)));
        toast.success('College updated');
      } else {
        setColleges((prev) => [...prev, saved]);
        toast.success('College added');
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save college');
    }
  };

  const deleteCollege = async (collegeId) => {
    if (!window.confirm('Delete this college?')) return;
    try {
      const res = await fetch(`/api/admin/colleges/${collegeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      setColleges((prev) => prev.filter((c) => c._id !== collegeId && c.id !== collegeId));
      toast.success('College deleted');
      if (editing && (editing._id === collegeId || editing.id === collegeId)) resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete college');
    }
  };

  if (authLoading || loading) {
    return <div className="shell py-16 text-center">Loading admin panel...</div>;
  }

  if (!user) {
    return (
      <main className="flex-1">
        <section className="shell py-20 text-center">
          <h1 className="text-3xl font-black text-slate-950">Admin access required</h1>
          <p className="mt-4 text-slate-600">Please log in as an admin to manage colleges.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 py-10">
      <div className="shell space-y-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Admin Panel</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">College Management</h1>
            </div>
            <div className="text-sm text-slate-600">Signed in as <span className="font-semibold text-slate-900">{user.name}</span></div>
          </div>

          <form onSubmit={saveCollege} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Name', name: 'name' },
              { label: 'Location', name: 'location' },
              { label: 'Category', name: 'category' },
              { label: 'Fees', name: 'fees', type: 'number' },
              { label: 'Rating', name: 'rating', type: 'number', step: '0.1' },
              { label: 'Average Package', name: 'averagePackage', type: 'number' },
              { label: 'Highest Package', name: 'highestPackage', type: 'number' },
              { label: 'Image URL', name: 'imageUrl' }
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  step={field.step}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                />
              </label>
            ))}

            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="text-sm font-semibold text-slate-700">Overview</span>
              <textarea
                name="overview"
                value={form.overview}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900"
                rows={3}
              />
            </label>

            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="text-sm font-semibold text-slate-700">Placements</span>
              <textarea
                name="placements"
                value={form.placements}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900"
                rows={2}
              />
            </label>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                {editing ? 'Update College' : 'Add College'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Existing Colleges</h2>
          <div className="mt-6 space-y-4">
            {colleges.map((college) => (
              <div key={college._id || college.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{college.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{college.location} • {college.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(college)}
                      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCollege(college._id || college.id)}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-3 text-sm text-slate-700">Fees: ₹{college.fees}</div>
                  <div className="rounded-lg bg-white p-3 text-sm text-slate-700">Rating: {college.rating}</div>
                  <div className="rounded-lg bg-white p-3 text-sm text-slate-700">Avg Package: ₹{college.averagePackage} LPA</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
