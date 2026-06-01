"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, MapPin, Clock, ShieldCheck, AlertCircle, Laptop, Landmark, Globe, FileText } from "lucide-react";
import { defaultAttendances } from "@/lib/data";

export default function AttendancePage() {
  const router = useRouter();
  const [attendances, setAttendances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState<any | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Attendances
      const storedAtt = localStorage.getItem("hrms_attendances");
      let currentAtt: any[] = [];
      if (storedAtt) {
        currentAtt = JSON.parse(storedAtt);
        setAttendances(currentAtt);
      } else {
        localStorage.setItem("hrms_attendances", JSON.stringify(defaultAttendances));
        currentAtt = defaultAttendances;
        setAttendances(defaultAttendances);
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
      let empId = "EMP-001";
      if (storedEmp) {
        const emps = JSON.parse(storedEmp);
        const current = emps.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
        if (current) {
          empId = current.id;
        }
      }
      setCurrentUserEmpId(empId);

      // Set default date filter to today
      setDateFilter(new Date().toISOString().split("T")[0]);

      // Check if already clocked in today
      const todayStr = new Date().toISOString().split("T")[0];
      const todayRec = currentAtt.find(a => a.userId === empId && a.date === todayStr);
      if (todayRec) {
        setTodayRecord(todayRec);
        setIsClockedIn(!!todayRec.clockInDateTime && !todayRec.clockOutDateTime);
      }

      const viewModeListener = () => {
        setViewMode((localStorage.getItem("session_view_mode") as any) || "manager");
      };

      const syncAttendance = () => {
        const storedAtt = localStorage.getItem("hrms_attendances");
        let currentAttSync: any[] = [];
        if (storedAtt) {
          currentAttSync = JSON.parse(storedAtt);
          setAttendances(currentAttSync);
        }
        
        // Find current employee code
        const emailSync = localStorage.getItem("session_company_email") || "admin@example.com";
        const storedEmpSync = localStorage.getItem("employees");
        let empIdSync = "EMP-001";
        if (storedEmpSync) {
          const emps = JSON.parse(storedEmpSync);
          const current = emps.find((e: any) => e.email.toLowerCase() === emailSync.toLowerCase());
          if (current) {
            empIdSync = current.id;
          }
        }

        const todayStrSync = new Date().toISOString().split("T")[0];
        const todayRecSync = currentAttSync.find(a => a.userId === empIdSync && a.date === todayStrSync);
        if (todayRecSync) {
          setTodayRecord(todayRecSync);
          setIsClockedIn(!!todayRecSync.clockInDateTime && !todayRecSync.clockOutDateTime);
        } else {
          setTodayRecord(null);
          setIsClockedIn(false);
        }
      };

      window.addEventListener("viewModeChanged", viewModeListener);
      window.addEventListener("attendanceChanged", syncAttendance);
      return () => {
        window.removeEventListener("viewModeChanged", viewModeListener);
        window.removeEventListener("attendanceChanged", syncAttendance);
      };
    }
  }, [router]);

  const handleClockIn = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const nowStr = new Date().toISOString();
    
    // Simulate browser telemetry capture
    const lat = 19.0760 + (Math.random() - 0.5) * 0.01;
    const lng = 72.8777 + (Math.random() - 0.5) * 0.01;
    const ip = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
    
    const newRecord = {
      id: attendances.length > 0 ? Math.max(...attendances.map(a => a.id)) + 1 : 1,
      userId: currentUserEmpId,
      date: todayStr,
      clockInDateTime: nowStr,
      clockOutDateTime: null,
      clockInIpAddress: ip,
      clockInLatitude: lat,
      clockInLongitude: lng,
      clockInLocationName: "Mumbai Corporate Office (Punch)",
      status: "Present",
      isHalfDay: false,
      isLate: new Date().getHours() >= 9 && new Date().getMinutes() > 10
    };

    const updated = [newRecord, ...attendances];
    setAttendances(updated);
    localStorage.setItem("hrms_attendances", JSON.stringify(updated));
    setTodayRecord(newRecord);
    setIsClockedIn(true);
    setSuccess("Clock-in recorded successfully! Have a productive day.");
    window.dispatchEvent(new Event("attendanceChanged"));
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleClockOut = () => {
    if (!todayRecord) return;
    const nowStr = new Date().toISOString();

    const updatedRec = {
      ...todayRecord,
      clockOutDateTime: nowStr,
      clockOutIpAddress: `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
      clockOutLatitude: todayRecord.clockInLatitude,
      clockOutLongitude: todayRecord.clockInLongitude,
      clockOutLocationName: todayRecord.clockInLocationName
    };

    const updated = attendances.map(a => (a.id === todayRecord.id ? updatedRec : a));
    setAttendances(updated);
    localStorage.setItem("hrms_attendances", JSON.stringify(updated));
    setTodayRecord(updatedRec);
    setIsClockedIn(false);
    setSuccess("Clock-out recorded successfully! See you tomorrow.");
    window.dispatchEvent(new Event("attendanceChanged"));
    setTimeout(() => setSuccess(null), 3000);
  };

  // Filter lists
  const myAttendances = attendances.filter(a => a.userId === currentUserEmpId);

  const filtered = attendances.filter(a => {
    const emp = employees.find(e => e.id === a.userId);
    const matchesSearch = emp?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || a.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || a.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Attendance" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF VIEW: ESS PUNCH CARD */
          <div className="max-w-4xl">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Clock In / Out Timesheet</h2>
                <p className="mt-1 text-sm text-slate-500">Punch in your daily work times. Browser geo-telemetry is locked to office branches.</p>
              </div>
              <Link
                href={"/dashboard/reports?tab=my_attendance" as any}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
              >
                <FileText className="size-4 text-indigo-500" /> View Attendance Report
              </Link>
            </header>

            {success && (
              <div className="mb-5 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 animate-pulse">
                <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {/* PUNCH CARD */}
              <Card className="col-span-1 border-slate-200 p-6 flex flex-col justify-between h-72 bg-white shadow-sm">
                <div>
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-1">
                    <Clock className="size-4 text-indigo-500 animate-spin" /> Attendance Console
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Current shift: General Shift</span>
                </div>

                <div className="my-6 text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                </div>

                {!isClockedIn ? (
                  <button
                    onClick={handleClockIn}
                    className="w-full rounded bg-indigo-600 hover:bg-indigo-700 transition py-3 font-black text-white shadow text-xs uppercase tracking-wider"
                  >
                    Clock In
                  </button>
                ) : (
                  <button
                    onClick={handleClockOut}
                    className="w-full rounded bg-rose-600 hover:bg-rose-700 transition py-3 font-black text-white shadow text-xs uppercase tracking-wider animate-pulse"
                  >
                    Clock Out
                  </button>
                )}
              </Card>

              {/* TELEMETRY CARD */}
              <Card className="col-span-2 border-slate-200 p-6 shadow-sm bg-white">
                <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Globe className="size-4 text-indigo-500" /> Active Punch Geolocation
                </h4>
                {todayRecord ? (
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Clock-in Time</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {new Date(todayRecord.clockInDateTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Clock-out Time</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {todayRecord.clockOutDateTime ? new Date(todayRecord.clockOutDateTime).toLocaleTimeString() : "Active Shift"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Punch IP Address</span>
                        <span className="font-bold text-slate-800 font-mono">{todayRecord.clockInIpAddress}</span>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-50 border border-slate-100 p-3 rounded">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Mock Coordinate Locking</span>
                        <span className="font-bold text-slate-800 font-mono text-[10px] block mt-0.5">Lat: {todayRecord.clockInLatitude.toFixed(6)}</span>
                        <span className="font-bold text-slate-800 font-mono text-[10px] block">Lng: {todayRecord.clockInLongitude.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Branch Radius Accuracy</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="size-3.5" /> 98.4% (Within Geofence)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-center">
                    <AlertCircle className="size-8 text-slate-300 mb-2" />
                    <p className="font-semibold text-xs">No active clock-in session found for today.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Punch in from the console to verify coordinates.</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Attendance Roster Log */}
            <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
              <Clock className="size-5 text-indigo-500" /> My Attendance timesheet log
            </h3>
            
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Clock In</th>
                      <th className="p-4">Clock Out</th>
                      <th className="p-4">Punch Location Branch</th>
                      <th className="p-4 font-mono">IP Address</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {myAttendances.length > 0 ? (
                      myAttendances.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono font-bold text-slate-800">{att.date}</td>
                          <td className="p-4 font-mono text-slate-600">
                            {att.clockInDateTime ? new Date(att.clockInDateTime).toLocaleTimeString() : "-"}
                          </td>
                          <td className="p-4 font-mono text-slate-600">
                            {att.clockOutDateTime ? new Date(att.clockOutDateTime).toLocaleTimeString() : att.clockInDateTime ? "Active" : "-"}
                          </td>
                          <td className="p-4 text-slate-500 font-normal">
                            <span className="flex items-center gap-1"><MapPin className="size-3.5 text-indigo-500" /> {att.clockInLocationName || "Head Office"}</span>
                          </td>
                          <td className="p-4 font-mono text-slate-500">{att.clockInIpAddress || "192.168.1.10"}</td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              att.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                            }`}>
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                          No logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          /* MANAGER VIEW: ATTENDANCE TIMESHEET REGISTER */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Attendance Timesheet Register</h2>
                <p className="mt-1 text-sm text-slate-500">Monitor employee log details, browser location tracking records, and geofence geocodes.</p>
              </div>
              <Link
                href={"/dashboard/reports?tab=attendance" as any}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
              >
                <FileText className="size-4 text-indigo-500" /> View Attendance Reports
              </Link>
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
                <span className="text-xs font-bold text-slate-400 tracking-wider shrink-0 uppercase">Select Date</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-10 rounded-md border border-slate-200 px-3 text-sm bg-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Roster table */}
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Clock In</th>
                      <th className="p-4">Clock Out</th>
                      <th className="p-4 font-mono">Telemetry (IP & Location)</th>
                      <th className="p-4">Late Punch</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {filtered.length > 0 ? (
                      filtered.map((att) => {
                        const empObj = employees.find(e => e.id === att.userId);
                        return (
                          <tr key={att.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              {empObj ? (
                                <div className="flex items-center gap-3">
                                  <div className="grid size-9 place-items-center rounded-full bg-slate-100 font-bold text-slate-600 text-sm">
                                    {empObj.fullName.slice(0, 1).toUpperCase()}
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
                            <td className="p-4 font-mono text-slate-600 font-bold">{att.date}</td>
                            <td className="p-4 font-mono text-slate-700">
                              {att.clockInDateTime ? new Date(att.clockInDateTime).toLocaleTimeString() : "-"}
                            </td>
                            <td className="p-4 font-mono text-slate-700">
                              {att.clockOutDateTime ? new Date(att.clockOutDateTime).toLocaleTimeString() : att.clockInDateTime ? "Active" : "-"}
                            </td>
                            <td className="p-4 text-slate-500 font-normal">
                              <p className="font-mono text-[10px]">{att.clockInIpAddress || "192.168.1.15"}</p>
                              {att.clockInLatitude && (
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Coords: {att.clockInLatitude.toFixed(4)}, {att.clockInLongitude.toFixed(4)}</p>
                              )}
                            </td>
                            <td className="p-4">
                              {att.isLate ? (
                                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">Late Punch</span>
                              ) : (
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">On Time</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                att.status === "Present" || att.status === "Late" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                          No attendance records found for selection.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
