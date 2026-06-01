"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Trash2, X, Award, Gift, Calendar, User, Info } from "lucide-react";
import { defaultAppreciations, defaultAwards } from "@/lib/data";

export default function AppreciationsPage() {
  const router = useRouter();
  const [appreciations, setAppreciations] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Modal and Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [awardUserId, setAwardUserId] = useState("");
  const [awardId, setAwardId] = useState<number>(1);
  const [priceAmount, setPriceAmount] = useState(0);
  const [awardDate, setAwardDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Appreciations
      const storedAppr = localStorage.getItem("hrms_appreciations");
      if (storedAppr) {
        setAppreciations(JSON.parse(storedAppr));
      } else {
        localStorage.setItem("hrms_appreciations", JSON.stringify(defaultAppreciations));
        setAppreciations(defaultAppreciations);
      }

      // Load Awards list
      const storedAwards = localStorage.getItem("hrms_awards");
      if (storedAwards) {
        setAwards(JSON.parse(storedAwards));
      } else {
        localStorage.setItem("hrms_awards", JSON.stringify(defaultAwards));
        setAwards(defaultAwards);
      }

      // Load Employees
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        setEmployees(JSON.parse(storedEmp));
      }

      // View Mode Context
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      setCurrentUserEmail(email);

      // Find current employee code
      if (storedEmp) {
        const emps = JSON.parse(storedEmp);
        const current = emps.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
        if (current) {
          setCurrentUserEmpId(current.id);
        } else {
          setCurrentUserEmpId("EMP-001");
        }
      } else {
        setCurrentUserEmpId("EMP-001");
      }

      const listener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      };
      window.addEventListener("viewModeChanged", listener);
      return () => window.removeEventListener("viewModeChanged", listener);
    }
  }, [router]);

  const handleOpenAdd = () => {
    setAwardUserId(employees[0]?.id || "");
    setAwardId(awards[0]?.id || 1);
    const selectedAward = awards.find(a => a.id === (awards[0]?.id || 1));
    setPriceAmount(selectedAward?.awardPrice || 0);
    setAwardDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleAwardChange = (id: number) => {
    setAwardId(id);
    const selectedAward = awards.find(a => a.id === Number(id));
    setPriceAmount(selectedAward?.awardPrice || 0);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this appreciation log?")) {
      const updated = appreciations.filter(a => a.id !== id);
      setAppreciations(updated);
      localStorage.setItem("hrms_appreciations", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!awardUserId || !awardId || !awardDate || !description.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    const newId = appreciations.length > 0 ? Math.max(...appreciations.map(a => a.id)) + 1 : 1;
    const payload = {
      id: newId,
      userId: awardUserId,
      awardId: Number(awardId),
      date: awardDate,
      priceAmount: Number(priceAmount),
      description: description
    };

    const updated = [payload, ...appreciations];
    setAppreciations(updated);
    localStorage.setItem("hrms_appreciations", JSON.stringify(updated));
    setSuccess("Appreciation awarded successfully!");
    setTimeout(() => setModalOpen(false), 800);
  };

  // Filter lists
  const myAppreciations = appreciations.filter(a => a.userId === currentUserEmpId);

  const filtered = appreciations.filter(a => {
    const emp = employees.find(e => e.id === a.userId);
    const award = awards.find(aw => aw.id === a.awardId);
    const query = searchQuery.toLowerCase();
    
    return (
      (emp?.fullName || "").toLowerCase().includes(query) ||
      (award?.name || "").toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Appreciations" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF VIEW: My Recognition */
          <div>
            <header className="mb-6 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900">My Appreciations & Awards</h2>
              <p className="mt-1 text-sm text-slate-500">View awards, cash bonuses, and team recognitions earned by your profile.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myAppreciations.map((appr) => {
                const awardObj = awards.find(a => a.id === appr.awardId);
                return (
                  <Card key={appr.id} className="border-slate-200 shadow-sm p-6 bg-white flex flex-col justify-between h-56 hover:border-indigo-300 transition">
                    <div>
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                        <div className="p-3 bg-amber-50 rounded-full text-amber-600">
                          <Award className="size-6 animate-bounce" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">{awardObj?.name || "Corporate Honor"}</h3>
                          <span className="text-[10px] font-mono text-slate-400">Awarded: {appr.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-3">{appr.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Gift className="size-4" /> Prize Value
                      </span>
                      <Badge>INR {appr.priceAmount?.toLocaleString()}</Badge>
                    </div>
                  </Card>
                );
              })}

              {myAppreciations.length === 0 && (
                <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
                  You haven't received any awards or appreciations yet. Keep up the great work!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MANAGER VIEW: Appreciations List */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Appreciation Logs</h2>
                <p className="mt-1 text-sm text-slate-500">Acknowledge corporate milestone achievements and award cash prizes to employees.</p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
              >
                <Plus className="size-4" /> Award Appreciation
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
                  placeholder="Search by employee, award name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* List Table */}
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Award Title</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Cash Price</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filtered.length > 0 ? (
                      filtered.map((appr) => {
                        const empObj = employees.find(e => e.id === appr.userId);
                        const awardObj = awards.find(a => a.id === appr.awardId);
                        return (
                          <tr key={appr.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              {empObj ? (
                                <div className="flex items-center gap-3">
                                  <div className="grid size-9 place-items-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm">
                                    <User className="size-4 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-900 text-sm">{empObj.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{empObj.id}</p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Unknown</span>
                              )}
                            </td>
                            <td className="p-4">
                              <Badge>{awardObj?.name || "Appreciation"}</Badge>
                            </td>
                            <td className="p-4 max-w-xs truncate text-slate-500 font-normal" title={appr.description}>
                              {appr.description}
                            </td>
                            <td className="p-4 text-slate-600 font-mono font-bold">{appr.date}</td>
                            <td className="p-4 text-slate-800 font-bold">₹{appr.priceAmount?.toLocaleString() || 0}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDelete(appr.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                                title="Delete Log"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                          No appreciations log recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

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

              <h3 className="text-base font-black text-slate-900 mb-2">Award Appreciation</h3>
              <p className="text-xs text-slate-400 mb-4">
                Select an employee and choose an award category to log positive feedback.
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
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Select Employee
                    <select
                      value={awardUserId}
                      onChange={(e) => setAwardUserId(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                      required
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Select Award
                    <select
                      value={awardId}
                      onChange={(e) => handleAwardChange(Number(e.target.value))}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                      required
                    >
                      {awards.map(aw => (
                        <option key={aw.id} value={aw.id}>{aw.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Award Date
                    <input
                      type="date"
                      value={awardDate}
                      onChange={(e) => setAwardDate(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Cash Bonus Price (INR)
                    <input
                      type="number"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(Number(e.target.value))}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>
                </div>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Appreciation Citation Description
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a supportive citation details..."
                    className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none"
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
                    Award Recognition
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
