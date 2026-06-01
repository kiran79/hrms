"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card } from "@/components/ui";
import { Search, Plus, Edit, Trash2, X, Briefcase, Award } from "lucide-react";
import { defaultDesignations } from "@/lib/data";

export default function DesignationsPage() {
  const router = useRouter();
  const [designations, setDesignations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState<any | null>(null);
  const [desigName, setDesigName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      const stored = localStorage.getItem("hrms_designations");
      if (stored) {
        setDesignations(JSON.parse(stored));
      } else {
        localStorage.setItem("hrms_designations", JSON.stringify(defaultDesignations));
        setDesignations(defaultDesignations);
      }
    }
  }, [router]);

  const handleOpenAdd = () => {
    setEditingDesig(null);
    setDesigName("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (desig: any) => {
    setEditingDesig(desig);
    setDesigName(desig.name);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this designation?")) {
      const updated = designations.filter((d) => d.id !== id);
      setDesignations(updated);
      localStorage.setItem("hrms_designations", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!desigName.trim()) {
      setError("Designation name is required.");
      return;
    }

    let updated;
    if (editingDesig) {
      updated = designations.map((d) => (d.id === editingDesig.id ? { ...d, name: desigName } : d));
      setSuccess("Designation updated successfully!");
    } else {
      const newId = designations.length > 0 ? Math.max(...designations.map((d) => d.id)) + 1 : 1;
      updated = [...designations, { id: newId, name: desigName }];
      setSuccess("New designation created successfully!");
    }

    setDesignations(updated);
    localStorage.setItem("hrms_designations", JSON.stringify(updated));
    setTimeout(() => setModalOpen(false), 800);
  };

  const filtered = designations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Designations" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Designations Setup</h2>
            <p className="mt-1 text-sm text-slate-500">Configure corporate job titles, responsibilities, and hierarchy tags.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
          >
            <Plus className="size-4" /> Add Designation
          </button>
        </header>

        {/* Search */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search designations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((desig) => (
            <Card key={desig.id} className="border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition flex flex-col justify-between h-40">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">{desig.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: DESIG-{desig.id}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Award className="size-3.5" /> Corporate Grade
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(desig)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition"
                    title="Edit Designation"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(desig.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                    title="Delete Designation"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
              No designations found. Click "Add Designation" to create one.
            </div>
          )}
        </div>

        {/* Modal Dialog */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-2">
                {editingDesig ? "Modify Designation" : "Create Designation"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Define the job title name. This binds with employee contracts and CTC breakdowns.
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Designation Job Title
                  <input
                    type="text"
                    value={desigName}
                    onChange={(e) => setDesigName(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
