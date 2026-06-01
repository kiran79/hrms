"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Edit, Trash2, X, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { defaultShifts } from "@/lib/data";

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);

  // Form states
  const [shiftName, setShiftName] = useState("");
  const [clockIn, setClockIn] = useState("09:00");
  const [clockOut, setClockOut] = useState("18:00");
  const [lateMark, setLateMark] = useState(10);
  const [selfClocking, setSelfClocking] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      const stored = localStorage.getItem("hrms_shifts");
      if (stored) {
        setShifts(JSON.parse(stored));
      } else {
        localStorage.setItem("hrms_shifts", JSON.stringify(defaultShifts));
        setShifts(defaultShifts);
      }
    }
  }, [router]);

  const handleOpenAdd = () => {
    setEditingShift(null);
    setShiftName("");
    setClockIn("09:00");
    setClockOut("18:00");
    setLateMark(10);
    setSelfClocking(true);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (shift: any) => {
    setEditingShift(shift);
    setShiftName(shift.name);
    setClockIn(shift.clockInTime);
    setClockOut(shift.clockOutTime);
    setLateMark(shift.lateMarkAfter || 10);
    setSelfClocking(shift.selfClocking ?? true);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this shift?")) {
      const updated = shifts.filter((s) => s.id !== id);
      setShifts(updated);
      localStorage.setItem("hrms_shifts", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!shiftName.trim()) {
      setError("Shift name is required.");
      return;
    }

    let updated;
    const payload = {
      id: editingShift ? editingShift.id : (shifts.length > 0 ? Math.max(...shifts.map((s) => s.id)) + 1 : 1),
      name: shiftName,
      clockInTime: clockIn,
      clockOutTime: clockOut,
      lateMarkAfter: Number(lateMark),
      selfClocking: selfClocking
    };

    if (editingShift) {
      updated = shifts.map((s) => (s.id === editingShift.id ? payload : s));
      setSuccess("Shift schedule updated successfully!");
    } else {
      updated = [...shifts, payload];
      setSuccess("New shift schedule created successfully!");
    }

    setShifts(updated);
    localStorage.setItem("hrms_shifts", JSON.stringify(updated));
    setTimeout(() => setModalOpen(false), 800);
  };

  const filtered = shifts.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Shifts" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Work Shifts Setup</h2>
            <p className="mt-1 text-sm text-slate-500">Configure corporate timing parameters, grace periods, and self-clocking restrictions.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
          >
            <Plus className="size-4" /> Add Work Shift
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
              placeholder="Search shifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((shift) => (
            <Card key={shift.id} className="border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition flex flex-col justify-between h-44">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{shift.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: SHIFT-{shift.id}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Clock In</span>
                    <span className="text-slate-700">{shift.clockInTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Clock Out</span>
                    <span className="text-slate-700">{shift.clockOutTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="font-bold">Late mark:</span>
                  <span>{shift.lateMarkAfter || 10}m grace</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${shift.selfClocking ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {shift.selfClocking ? "Self Clock" : "Manual"}
                  </span>
                  
                  <div className="flex items-center ml-1 border-l border-slate-200 pl-1.5 gap-1">
                    <button
                      onClick={() => handleOpenEdit(shift)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition"
                      title="Edit Shift"
                    >
                      <Edit className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(shift.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                      title="Delete Shift"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
              No shift configurations found. Click "Add Work Shift" to configure one.
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
                {editingShift ? "Modify Work Shift" : "Create Work Shift"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Define the shift name and schedule timings. This governs employee late marks and monthly office times.
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
                  Shift Schedule Name
                  <input
                    type="text"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    placeholder="e.g. Day Shift, Night Shift"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Clock In Time
                    <input
                      type="time"
                      value={clockIn}
                      onChange={(e) => setClockIn(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Clock Out Time
                    <input
                      type="time"
                      value={clockOut}
                      onChange={(e) => setClockOut(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Grace Period (Minutes)
                    <input
                      type="number"
                      value={lateMark}
                      onChange={(e) => setLateMark(Number(e.target.value))}
                      placeholder="e.g. 10"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>
                  
                  <div className="flex flex-col justify-end">
                    <span className="font-bold text-slate-500 uppercase mb-1">Self Clocking</span>
                    <button
                      type="button"
                      onClick={() => setSelfClocking(!selfClocking)}
                      className="h-10 flex items-center justify-between border border-slate-200 rounded px-3 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <span className="font-bold text-slate-600 text-xs">{selfClocking ? "Enabled" : "Disabled"}</span>
                      {selfClocking ? <ToggleRight className="size-5 text-indigo-600 shrink-0" /> : <ToggleLeft className="size-5 text-slate-400 shrink-0" />}
                    </button>
                  </div>
                </div>

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
                    Save Shift
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
