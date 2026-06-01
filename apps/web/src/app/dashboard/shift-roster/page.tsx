"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Edit, X, Calendar, User, Clock, CheckCircle } from "lucide-react";
import { defaultShifts } from "@/lib/data";

export default function ShiftRosterPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState<any | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<number>(1);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load employees
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        setEmployees(JSON.parse(storedEmp));
      }

      // Load shifts
      const storedShifts = localStorage.getItem("hrms_shifts");
      if (storedShifts) {
        setShifts(JSON.parse(storedShifts));
      } else {
        localStorage.setItem("hrms_shifts", JSON.stringify(defaultShifts));
        setShifts(defaultShifts);
      }
    }
  }, [router]);

  const handleOpenAssign = (employee: any) => {
    setTargetEmployee(employee);
    // Find the current shift matching name or ID
    const currentShift = shifts.find(s => s.name === employee.shift) || shifts[0];
    setSelectedShiftId(currentShift?.id || 1);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleAssignShift = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    const shiftObj = shifts.find(s => s.id === Number(selectedShiftId));
    if (!shiftObj || !targetEmployee) return;

    // Update shift on employee record
    const updated = employees.map(emp => {
      if (emp.id === targetEmployee.id) {
        return {
          ...emp,
          shift: shiftObj.name, // Bind shift name to match existing employee profiles
          shift_id: shiftObj.id
        };
      }
      return emp;
    });

    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
    setSuccess(`Shift successfully reassigned to ${shiftObj.name}!`);
    setTimeout(() => setModalOpen(false), 800);
  };

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

  const filtered = employees.filter(e => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Shift Roster" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Shift Roster Assignments</h2>
            <p className="mt-1 text-sm text-slate-500">View corporate shift schedules and assign shifts to active staff members.</p>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID or employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm bg-white outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Roster Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department & Job Title</th>
                  <th className="p-4">Assigned Shift</th>
                  <th className="p-4">Shift Timings</th>
                  <th className="p-4">Grace period</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((emp) => {
                    const empShiftName = emp.shift || "General Shift";
                    const shiftDetails = shifts.find(s => s.name === empShiftName) || shifts[0];
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 place-items-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm">
                              <User className="size-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm">{emp.fullName}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-800">{emp.department}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{emp.designation}</p>
                        </td>
                        <td className="p-4">
                          <Badge>{empShiftName}</Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-slate-600">
                            {shiftDetails ? `${shiftDetails.clockInTime} - ${shiftDetails.clockOutTime}` : "09:00 - 18:00"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {shiftDetails ? `${shiftDetails.lateMarkAfter || 10} min` : "10 min"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenAssign(emp)}
                            className="inline-flex items-center gap-1.5 rounded border border-indigo-200 bg-white hover:bg-indigo-50 transition text-indigo-600 px-3 py-1.5 font-bold"
                          >
                            <Edit className="size-3.5" /> Reassign Shift
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                      No employees match filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Assignment Modal */}
        {modalOpen && targetEmployee && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-2">Reassign Shift Schedule</h3>
              <p className="text-xs text-slate-400 mb-4">
                Assign a work shift for <span className="font-bold text-slate-700">{targetEmployee.fullName}</span>. This will immediately bind to their attendance log.
              </p>

              {success && (
                <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse flex items-center gap-2">
                  <CheckCircle className="size-4 shrink-0 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleAssignShift} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Select Work Shift
                  <select
                    value={selectedShiftId}
                    onChange={(e) => setSelectedShiftId(Number(e.target.value))}
                    className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                  >
                    {shifts.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.clockInTime} - {s.clockOutTime})
                      </option>
                    ))}
                  </select>
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
                    Assign Shift
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
