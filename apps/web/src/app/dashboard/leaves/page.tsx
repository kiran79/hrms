"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Check, X, CalendarCheck, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { defaultLeaves, defaultLeaveTypes } from "@/lib/data";

export default function LeavesPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [statusFilter, setStatusFilter] = useState("Pending");

  // Form States for Apply Leave
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tab state in Manager view
  const [managerTab, setManagerTab] = useState<"inbox" | "types">("inbox");

  // Form states for Leave Type CRUD
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<any | null>(null);
  const [typeName, setTypeName] = useState("");
  const [typeTotalDays, setTypeTotalDays] = useState(12);
  const [typeIsPaid, setTypeIsPaid] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Leaves
      const storedLeaves = localStorage.getItem("hrms_leaves");
      if (storedLeaves) {
        setLeaves(JSON.parse(storedLeaves));
      } else {
        localStorage.setItem("hrms_leaves", JSON.stringify(defaultLeaves));
        setLeaves(defaultLeaves);
      }

      // Load Leave Types
      const storedTypes = localStorage.getItem("hrms_leave_types");
      if (storedTypes) {
        setLeaveTypes(JSON.parse(storedTypes));
      } else {
        localStorage.setItem("hrms_leave_types", JSON.stringify(defaultLeaveTypes));
        setLeaveTypes(defaultLeaveTypes);
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

  const handleOpenApply = () => {
    setLeaveTypeId(leaveTypes[0]?.id || 1);
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setIsHalfDay(false);
    setReason("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleStatusChange = (id: number, newStatus: "Approved" | "Rejected") => {
    const updated = leaves.map(l => {
      if (l.id === id) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    setLeaves(updated);
    localStorage.setItem("hrms_leaves", JSON.stringify(updated));
  };

  // Leave Types CRUD handlers
  const openAddLeaveType = () => {
    setActiveType(null);
    setTypeName("");
    setTypeTotalDays(12);
    setTypeIsPaid(true);
    setTypeModalOpen(true);
  };

  const openEditLeaveType = (type: any) => {
    setActiveType(type);
    setTypeName(type.name);
    setTypeTotalDays(type.totalLeaves);
    setTypeIsPaid(type.isPaid);
    setTypeModalOpen(true);
  };

  const handleSaveLeaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) {
      alert("Leave Type Name is required");
      return;
    }

    let updated: any[];
    if (activeType) {
      // Edit existing
      updated = leaveTypes.map(t =>
        t.id === activeType.id
          ? { ...t, name: typeName.trim(), totalLeaves: Number(typeTotalDays), isPaid: typeIsPaid }
          : t
      );
    } else {
      // Create new
      const newId = leaveTypes.length > 0 ? Math.max(...leaveTypes.map(t => t.id)) + 1 : 1;
      const newType = {
        id: newId,
        name: typeName.trim(),
        totalLeaves: Number(typeTotalDays),
        isPaid: typeIsPaid
      };
      updated = [...leaveTypes, newType];
    }

    setLeaveTypes(updated);
    localStorage.setItem("hrms_leave_types", JSON.stringify(updated));
    setTypeModalOpen(false);
  };

  const handleDeleteLeaveType = (id: number) => {
    if (confirm("Are you sure you want to delete this leave type? This will remove it from all balances.")) {
      const updated = leaveTypes.filter(t => t.id !== id);
      setLeaveTypes(updated);
      localStorage.setItem("hrms_leave_types", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!startDate || !endDate || !reason.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError("End date cannot be prior to start date.");
      return;
    }

    // Calculate total days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isHalfDay) diffDays = 0.5;

    const newId = leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 1;
    const payload = {
      id: newId,
      userId: currentUserEmpId,
      leaveTypeId: Number(leaveTypeId),
      startDate: startDate,
      endDate: isHalfDay ? startDate : endDate,
      totalDays: diffDays,
      isHalfDay: isHalfDay,
      reason: reason,
      isPaid: leaveTypes.find(t => t.id === Number(leaveTypeId))?.isPaid ?? true,
      status: "Pending"
    };

    const updated = [payload, ...leaves];
    setLeaves(updated);
    localStorage.setItem("hrms_leaves", JSON.stringify(updated));
    setSuccess("Leave application submitted successfully!");
    setTimeout(() => setModalOpen(false), 800);
  };

  // Filter leaves
  const myLeaves = leaves.filter(l => l.userId === currentUserEmpId);

  const managerFiltered = leaves.filter(l => {
    if (statusFilter === "All") return true;
    return l.status === statusFilter;
  });

  // Calculate my leave balances
  const getLeavesTaken = (typeId: number) => {
    return leaves
      .filter(l => l.userId === currentUserEmpId && l.leaveTypeId === typeId && l.status === "Approved")
      .reduce((sum, current) => sum + current.totalDays, 0);
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Leaves" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF VIEW: ESS LEAVE INTERFACE */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Leave Balance & Apply</h2>
                <p className="mt-1 text-sm text-slate-500">Apply for leaves, view balances, and check status of submitted requests.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=my_leaves" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Leave Ledger
                </Link>
                <button
                  onClick={handleOpenApply}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
                >
                  <Plus className="size-4" /> Apply for Leave
                </button>
              </div>
            </header>

            {/* Balances */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {leaveTypes.map((type) => {
                const taken = getLeavesTaken(type.id);
                const remaining = Math.max(0, type.totalLeaves - taken);
                return (
                  <Card key={type.id} className="p-5 bg-white border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-indigo-200 transition">
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{type.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{type.isPaid ? "Paid Leave" : "Unpaid Leave"}</p>
                    </div>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Taken / Total</span>
                        <span className="text-xs font-bold text-slate-500">{taken} / {type.totalLeaves} days</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Available</span>
                        <span className="text-xl font-black text-indigo-600">{remaining} Days</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Roster list */}
            <h3 className="font-black text-slate-800 text-base mb-4 flex items-center gap-2">
              <CalendarCheck className="size-5 text-indigo-500" /> My Leave History
            </h3>
            
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Leave Type</th>
                      <th className="p-4">Start Date</th>
                      <th className="p-4">End Date</th>
                      <th className="p-4">Total Days</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {myLeaves.length > 0 ? (
                      myLeaves.map((leave) => {
                        const typeObj = leaveTypes.find(t => t.id === leave.leaveTypeId);
                        return (
                          <tr key={leave.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <Badge>{typeObj?.name || "Casual Leave"}</Badge>
                            </td>
                            <td className="p-4 font-mono text-slate-600">{leave.startDate}</td>
                            <td className="p-4 font-mono text-slate-600">{leave.endDate}</td>
                            <td className="p-4 text-slate-800">{leave.totalDays} Days</td>
                            <td className="p-4 font-normal text-slate-500 max-w-xs truncate">{leave.reason}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                leave.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                                leave.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                          You haven't applied for any leaves yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          /* MANAGER VIEW: LEAVE APPROVAL INBOX */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Leave Approvals Inbox</h2>
                <p className="mt-1 text-sm text-slate-500">Review employee leave applications and manage statutory balances.</p>
              </div>
              <Link
                href={"/dashboard/reports?tab=leaves" as any}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
              >
                <FileText className="size-4 text-indigo-500" /> View Leave Reports
              </Link>
            </header>

            {/* Manager View Tabs Switcher */}
            <div className="flex border-b border-slate-200 mb-6 bg-white rounded-lg p-1.5 shadow-sm max-w-md">
              <button
                onClick={() => setManagerTab("inbox")}
                className={`flex-1 text-center py-2.5 rounded-md text-xs font-black transition flex items-center justify-center gap-2 ${
                  managerTab === "inbox"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <FileText className="size-4" />
                Inbox Requests
              </button>
              <button
                onClick={() => setManagerTab("types")}
                className={`flex-1 text-center py-2.5 rounded-md text-xs font-black transition flex items-center justify-center gap-2 ${
                  managerTab === "types"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <CalendarCheck className="size-4" />
                Configure Leave Types
              </button>
            </div>

            {/* Tab 1: Inbox Requests */}
            {managerTab === "inbox" && (
              <>
                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xs font-bold text-slate-400 tracking-wider shrink-0 uppercase">Inbox Status</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm bg-white outline-none focus:border-indigo-500"
                    >
                      <option value="Pending">Pending Approvals</option>
                      <option value="Approved">Approved Log</option>
                      <option value="Rejected">Rejected Log</option>
                      <option value="All">All Requests</option>
                    </select>
                  </div>
                </div>

                {/* Requests Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-4">Employee</th>
                          <th className="p-4">Leave Type</th>
                          <th className="p-4">Schedule</th>
                          <th className="p-4">Days</th>
                          <th className="p-4">Reason</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {managerFiltered.length > 0 ? (
                          managerFiltered.map((leave) => {
                            const empObj = employees.find(e => e.id === leave.userId);
                            const typeObj = leaveTypes.find(t => t.id === leave.leaveTypeId);
                            return (
                              <tr key={leave.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4">
                                  {empObj ? (
                                    <div>
                                      <p className="font-black text-slate-900 text-sm">{empObj.fullName}</p>
                                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{empObj.id}</p>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">Unknown</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <Badge>{typeObj?.name || "Casual Leave"}</Badge>
                                </td>
                                <td className="p-4 text-slate-600 font-mono">
                                  {leave.startDate} to {leave.endDate}
                                </td>
                                <td className="p-4 text-slate-800">{leave.totalDays} Days</td>
                                <td className="p-4 text-slate-500 font-normal max-w-xs truncate" title={leave.reason}>
                                  {leave.reason}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    leave.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                                    leave.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                                  }`}>
                                    {leave.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {leave.status === "Pending" ? (
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleStatusChange(leave.id, "Approved")}
                                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200 transition font-bold flex items-center gap-1 px-2.5 py-1"
                                      >
                                        <Check className="size-3.5" /> Approve
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(leave.id, "Rejected")}
                                        className="p-1 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 transition font-bold flex items-center gap-1 px-2.5 py-1"
                                      >
                                        <X className="size-3.5" /> Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic font-normal">Processed</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                              No leave applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {/* Tab 2: Configure Leave Types */}
            {managerTab === "types" && (
              <Card className="border-slate-200 shadow-sm p-6 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Leave Types Configuration</h3>
                    <p className="text-xs text-slate-400 mt-1">Configure company leave policies, annual quotas, and payment rules.</p>
                  </div>
                  <button
                    onClick={openAddLeaveType}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-black text-white shadow-sm transition"
                  >
                    <Plus className="size-4" /> Add Leave Type
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Leave Type Name</th>
                        <th className="p-4">Payment Rule</th>
                        <th className="p-4">Annual Quota Allocation</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {leaveTypes.length > 0 ? (
                        leaveTypes.map((type) => (
                          <tr key={type.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4 font-bold text-slate-900">{type.name}</td>
                            <td className="p-4">
                              {type.isPaid ? (
                                <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5">
                                  PAID LEAVE
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5">
                                  UNPAID LEAVE
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-800 font-bold">{type.totalLeaves} Days per year</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditLeaveType(type)}
                                  className="rounded border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 transition px-2.5 py-1.5 text-xs font-bold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLeaveType(type.id)}
                                  className="rounded border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition px-2.5 py-1.5 text-xs font-bold"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold italic">
                            No leave types configured. Click "Add Leave Type" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Apply Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-2">Apply for Leave</h3>
              <p className="text-xs text-slate-400 mb-4">
                Fill out the form below to request time off. This will be routed to your Reporting Manager.
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
                    Leave Type
                    <select
                      value={leaveTypeId}
                      onChange={(e) => setLeaveTypeId(Number(e.target.value))}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                      required
                    >
                      {leaveTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.totalLeaves} days)</option>
                      ))}
                    </select>
                  </label>

                  <div className="flex flex-col justify-end">
                    <span className="font-bold text-slate-500 uppercase mb-1">Half Day Request</span>
                    <button
                      type="button"
                      onClick={() => setIsHalfDay(!isHalfDay)}
                      className="h-10 flex items-center justify-between border border-slate-200 rounded px-3 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <span className="font-bold text-slate-600 text-xs">{isHalfDay ? "Half Day" : "Full Day"}</span>
                      {isHalfDay ? <ToggleRight className="size-5 text-indigo-600 shrink-0" /> : <ToggleLeft className="size-5 text-slate-400 shrink-0" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Start Date
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>

                  {!isHalfDay && (
                    <label className="grid gap-1 font-bold text-slate-500 uppercase">
                      End Date
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                        required
                      />
                    </label>
                  )}
                </div>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Reason for Time Off
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly state why you need leave..."
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
                    Submit Application
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>

      {/* Leave Type CRUD Dialog */}
      {typeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 animate-out fade-out-0">
            <button
              onClick={() => setTypeModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-2">
              {activeType ? "Edit Leave Type" : "Add Leave Type"}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Define the name, payment status, and yearly quota allocation for this leave category.
            </p>

            <form onSubmit={handleSaveLeaveType} className="space-y-4 text-xs">
              <label className="grid gap-1 font-bold text-slate-500 uppercase">
                Leave Type Name
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800 font-bold"
                  placeholder="e.g. Study Leave"
                  required
                />
              </label>

              <label className="grid gap-1 font-bold text-slate-500 uppercase">
                Annual Quota (Days)
                <input
                  type="number"
                  value={typeTotalDays}
                  onChange={(e) => setTypeTotalDays(Number(e.target.value))}
                  className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-white text-slate-800 font-bold"
                  min={0}
                  required
                />
              </label>

              <label className="grid gap-1 font-bold text-slate-500 uppercase">
                Payment Status
                <select
                  value={typeIsPaid ? "true" : "false"}
                  onChange={(e) => setTypeIsPaid(e.target.value === "true")}
                  className="h-10 rounded border border-slate-200 px-2 bg-white text-slate-800 outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="true">Paid Leave</option>
                  <option value="false">Unpaid Leave (Loss of Pay)</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTypeModalOpen(false)}
                  className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-black text-white shadow"
                >
                  Save Leave Type
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}
