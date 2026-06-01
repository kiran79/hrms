"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Trash2, X, Calendar, ToggleLeft, ToggleRight } from "lucide-react";
import { defaultHolidays } from "@/lib/data";

export default function HolidaysPage() {
  const router = useRouter();
  const [holidays, setHolidays] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");

  const [modalOpen, setModalOpen] = useState(false);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      const stored = localStorage.getItem("hrms_holidays");
      if (stored) {
        setHolidays(JSON.parse(stored));
      } else {
        localStorage.setItem("hrms_holidays", JSON.stringify(defaultHolidays));
        setHolidays(defaultHolidays);
      }

      setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");

      const listener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  const handleOpenAdd = () => {
    setHolidayName("");
    setHolidayDate(new Date().toISOString().split("T")[0]);
    setIsHalfDay(false);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this holiday?")) {
      const updated = holidays.filter((h) => h.id !== id);
      setHolidays(updated);
      localStorage.setItem("hrms_holidays", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!holidayName.trim() || !holidayDate) {
      setError("Please specify holiday name and date.");
      return;
    }

    const newId = holidays.length > 0 ? Math.max(...holidays.map((h) => h.id)) + 1 : 1;
    const payload = {
      id: newId,
      name: holidayName,
      date: holidayDate,
      isWeekend: new Date(holidayDate).getDay() === 0 || new Date(holidayDate).getDay() === 6,
      isHalfDay: isHalfDay
    };

    const updated = [...holidays, payload].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setHolidays(updated);
    localStorage.setItem("hrms_holidays", JSON.stringify(updated));
    setSuccess("Holiday added successfully!");
    setTimeout(() => setModalOpen(false), 800);
  };

  const filtered = holidays.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Holidays" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Holiday Calendar</h2>
            <p className="mt-1 text-sm text-slate-500">View and configure list of official public, national, and state-wide holidays.</p>
          </div>
          {viewMode === "manager" && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="size-4" /> Add Holiday
            </button>
          )}
        </header>

        {/* Search */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search holidays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* List */}
        <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Holiday Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Day</th>
                  <th className="p-4">Holiday Type</th>
                  {viewMode === "manager" && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((hol) => {
                    const dateObj = new Date(hol.date);
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
                    return (
                      <tr key={hol.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                              <Calendar className="size-4" />
                            </div>
                            <span className="font-black text-slate-800 text-sm">{hol.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono font-bold">{hol.date}</td>
                        <td className="p-4 text-slate-500">{dayName}</td>
                        <td className="p-4">
                          {hol.isHalfDay ? (
                            <Badge>Half Day Holiday</Badge>
                          ) : (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                              Full Day Public Holiday
                            </span>
                          )}
                        </td>
                        {viewMode === "manager" && (
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDelete(hol.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                              title="Delete Holiday"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                      No holidays scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

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

              <h3 className="text-base font-black text-slate-900 mb-2">Schedule Holiday</h3>
              <p className="text-xs text-slate-400 mb-4">
                Configure a new national or organization-wide public holiday.
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
                  Holiday Name/Title
                  <input
                    type="text"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    placeholder="e.g. Independence Day, Eid al-Fitr"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Select Date
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>
                  
                  <div className="flex flex-col justify-end">
                    <span className="font-bold text-slate-500 uppercase mb-1">Half Day Holiday</span>
                    <button
                      type="button"
                      onClick={() => setIsHalfDay(!isHalfDay)}
                      className="h-10 flex items-center justify-between border border-slate-200 rounded px-3 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <span className="font-bold text-slate-600 text-xs">{isHalfDay ? "Enabled" : "Disabled"}</span>
                      {isHalfDay ? <ToggleRight className="size-5 text-indigo-600 shrink-0" /> : <ToggleLeft className="size-5 text-slate-400 shrink-0" />}
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
                    Schedule Holiday
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
