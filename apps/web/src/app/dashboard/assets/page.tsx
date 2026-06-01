"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, Edit, Trash2, X, CreditCard, Laptop, ShieldAlert, Monitor, Phone, Gift, FileText } from "lucide-react";
import { defaultAssets, defaultAssetTypes } from "@/lib/data";

export default function AssetsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal and Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [assetName, setAssetName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState<number>(1);
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Available");
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [price, setPrice] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [managerTab, setManagerTab] = useState<"inventory" | "types" | "requests">("inventory");
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<any | null>(null);
  const [typeName, setTypeName] = useState("");
  const [assetRequests, setAssetRequests] = useState<any[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Assets
      const storedAssets = localStorage.getItem("hrms_assets");
      if (storedAssets) {
        setAssets(JSON.parse(storedAssets));
      } else {
        localStorage.setItem("hrms_assets", JSON.stringify(defaultAssets));
        setAssets(defaultAssets);
      }

      // Load Asset Types
      const storedTypes = localStorage.getItem("hrms_asset_types");
      if (storedTypes) {
        setAssetTypes(JSON.parse(storedTypes));
      } else {
        localStorage.setItem("hrms_asset_types", JSON.stringify(defaultAssetTypes));
        setAssetTypes(defaultAssetTypes);
      }

      // Load Employees
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        setEmployees(JSON.parse(storedEmp));
      }

      // Load Asset Requests
      const storedRequests = localStorage.getItem("hrms_asset_requests");
      if (storedRequests) {
        setAssetRequests(JSON.parse(storedRequests));
      } else {
        localStorage.setItem("hrms_asset_requests", JSON.stringify([]));
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
    setEditingAsset(null);
    setAssetName("");
    setAssetTypeId(assetTypes[0]?.id || 1);
    setSerialNumber("");
    setDescription("");
    setStatus("Available");
    setAssignedUserId("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setPrice(0);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (asset: any) => {
    setEditingAsset(asset);
    setAssetName(asset.name);
    setAssetTypeId(asset.assetTypeId);
    setSerialNumber(asset.serialNumber);
    setDescription(asset.description || "");
    setStatus(asset.status);
    setAssignedUserId(asset.userId || "");
    setPurchaseDate(asset.purchaseDate || "");
    setPrice(asset.price || 0);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      const updated = assets.filter(a => a.id !== id);
      setAssets(updated);
      localStorage.setItem("hrms_assets", JSON.stringify(updated));
    }
  };

  const handleReportBroken = (asset: any) => {
    if (confirm("Are you sure you want to report this asset as broken/damaged?")) {
      const updated = assets.map(a => {
        if (a.id === asset.id) {
          return { ...a, status: "Broken" };
        }
        return a;
      });
      setAssets(updated);
      localStorage.setItem("hrms_assets", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!assetName.trim() || !serialNumber.trim()) {
      setError("Asset Name and Serial Number are required.");
      return;
    }

    const payload = {
      id: editingAsset ? editingAsset.id : (assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1),
      name: assetName,
      assetTypeId: Number(assetTypeId),
      serialNumber: serialNumber,
      description: description,
      status: status,
      userId: assignedUserId ? assignedUserId : null,
      purchaseDate: purchaseDate,
      price: Number(price)
    };

    let updated;
    if (editingAsset) {
      updated = assets.map(a => (a.id === editingAsset.id ? payload : a));
      setSuccess("Asset details updated successfully!");
    } else {
      updated = [...assets, payload];
      setSuccess("New asset added to inventory!");

      // If we are fulfilling an IT request, mark it complete!
      if (activeRequestId !== null) {
        const updatedRequests = assetRequests.map(r => r.id === activeRequestId ? { ...r, status: "Allocated" } : r);
        setAssetRequests(updatedRequests);
        localStorage.setItem("hrms_asset_requests", JSON.stringify(updatedRequests));
        setActiveRequestId(null);
      }
    }

    setAssets(updated);
    localStorage.setItem("hrms_assets", JSON.stringify(updated));
    setTimeout(() => setModalOpen(false), 800);
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    let updated;
    if (editingType) {
      updated = assetTypes.map(t => t.id === editingType.id ? { ...t, name: typeName } : t);
      setSuccess("Asset Type updated successfully!");
    } else {
      const newId = assetTypes.length > 0 ? Math.max(...assetTypes.map(t => t.id)) + 1 : 1;
      updated = [...assetTypes, { id: newId, name: typeName }];
      setSuccess("Asset Type added successfully!");
    }

    setAssetTypes(updated);
    localStorage.setItem("hrms_asset_types", JSON.stringify(updated));
    setTypeName("");
    setEditingType(null);
    setTypeModalOpen(false);
  };

  const handleDeleteType = (id: number) => {
    if (confirm("Are you sure you want to delete this asset type? Assets under this type will fallback to generic type.")) {
      const updated = assetTypes.filter(t => t.id !== id);
      setAssetTypes(updated);
      localStorage.setItem("hrms_asset_types", JSON.stringify(updated));
    }
  };

  const handleAllotRequest = (req: any) => {
    setActiveRequestId(req.id);
    setEditingAsset(null);
    setAssetName("");
    setAssetTypeId(assetTypes[0]?.id || 1);
    setSerialNumber("");
    setDescription(`IT Equipment allotted for request: ${req.comments}`);
    setStatus("Allocated");
    setAssignedUserId(req.employeeId);
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setPrice(0);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  // Filters
  const myAssets = assets.filter(a => a.userId === currentUserEmpId);
  
  const filtered = assets.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAssetIcon = (typeId: number) => {
    if (typeId === 1) return <Laptop className="size-5 text-indigo-600" />;
    if (typeId === 2) return <Phone className="size-5 text-indigo-600" />;
    return <Monitor className="size-5 text-indigo-600" />;
  };

  // Stats for manager
  const totalCount = assets.length;
  const allocatedCount = assets.filter(a => a.status === "Allocated").length;
  const availableCount = assets.filter(a => a.status === "Available").length;
  const brokenCount = assets.filter(a => a.status === "Broken").length;

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Assets" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? (
          /* SELF VIEW: My Assets */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">My Allocated Assets</h2>
                <p className="mt-1 text-sm text-slate-500">Track company hardware, devices, and inventory assigned to your profile.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=my_assets" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Assets Reports
                </Link>
              </div>
            </header>

            {myAssets.length > 0 && (
              <div className="mb-6 rounded-md bg-indigo-50 border border-indigo-200 p-4 text-xs text-indigo-800 flex items-start gap-3 animate-in slide-in-from-top duration-300">
                <div className="p-1 bg-indigo-600 rounded text-white mt-0.5 shrink-0">
                  <Laptop className="size-4 animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold block text-sm">💡 New Corporate Equipment Assigned</span>
                  <p className="mt-1 text-slate-500 font-normal">
                    You have active company hardware allocated to your profile. Please check the items below and verify the serial numbers. Reach out to IT Team if you find any discrepancies.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myAssets.map((asset) => {
                const typeObj = assetTypes.find(t => t.id === asset.assetTypeId);
                return (
                  <Card key={asset.id} className="border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition flex flex-col justify-between h-48 bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-50 rounded">
                            {getAssetIcon(asset.assetTypeId)}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 text-sm">{asset.name}</h3>
                            <p className="text-[10px] text-slate-400 font-mono">Serial: {asset.serialNumber}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${asset.status === "Broken" ? "bg-rose-50 text-rose-700" : "bg-indigo-50 text-indigo-700"}`}>
                          {asset.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{asset.description || "No description provided."}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">Allocated: {asset.purchaseDate}</span>
                      {asset.status !== "Broken" && (
                        <button
                          onClick={() => handleReportBroken(asset)}
                          className="flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 transition px-2.5 py-1.5 rounded"
                        >
                          <ShieldAlert className="size-3.5" /> Report Damage
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}

              {myAssets.length === 0 && (
                <div className="col-span-full bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400 font-semibold shadow-sm">
                  You currently have no company assets allocated to your profile.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MANAGER VIEW: Assets Directory */
          <div>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Assets Inventory</h2>
                <p className="mt-1 text-sm text-slate-500">Track and allocate hardware devices, laptops, furniture, and IT equipment.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={"/dashboard/reports?tab=assets" as any}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
                >
                  <FileText className="size-4 text-indigo-500" /> View Assets Reports
                </Link>
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
                >
                  <Plus className="size-4" /> Add Asset
                </button>
              </div>
            </header>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400">
              <button
                type="button"
                onClick={() => setManagerTab("inventory")}
                className={`py-3 px-6 border-b-2 transition ${managerTab === "inventory" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
              >
                Inventory List
              </button>
              <button
                type="button"
                onClick={() => setManagerTab("types")}
                className={`py-3 px-6 border-b-2 transition ${managerTab === "types" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
              >
                Asset Types
              </button>
              <button
                type="button"
                onClick={() => setManagerTab("requests")}
                className={`py-3 px-6 border-b-2 transition ${managerTab === "requests" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
              >
                IT Allotment Requests
                {assetRequests.filter(r => r.status === "Pending").length > 0 && (
                  <Badge className="ml-2 bg-rose-500 text-white shrink-0">
                    {assetRequests.filter(r => r.status === "Pending").length}
                  </Badge>
                )}
              </button>
            </div>

            {managerTab === "inventory" && (
              <>
                {/* Stats */}
                <div className="mb-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                  <Card className="p-4 bg-white border-slate-200 text-center shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Inventory</span>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{totalCount}</p>
                  </Card>
                  <Card className="p-4 bg-white border-slate-200 text-center shadow-sm">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Available</span>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{availableCount}</p>
                  </Card>
                  <Card className="p-4 bg-white border-slate-200 text-center shadow-sm">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">Allocated</span>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{allocatedCount}</p>
                  </Card>
                  <Card className="p-4 bg-white border-slate-200 text-center shadow-sm">
                    <span className="text-[10px] font-bold text-rose-500 uppercase">Damaged/Broken</span>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{brokenCount}</p>
                  </Card>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <Search className="size-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search assets by name or serial..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 tracking-wider shrink-0 uppercase">Status</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 rounded-md border border-slate-200 px-3 text-sm bg-white outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Assets</option>
                      <option value="Available">Available</option>
                      <option value="Allocated">Allocated</option>
                      <option value="Broken">Broken</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-4">Asset Details</th>
                          <th className="p-4">Serial Number</th>
                          <th className="p-4">Asset Type</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Allocated To</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filtered.length > 0 ? (
                          filtered.map((asset) => {
                            const typeObj = assetTypes.find(t => t.id === asset.assetTypeId);
                            const assignedEmp = employees.find(e => e.id === asset.userId);
                            return (
                              <tr key={asset.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                                      {getAssetIcon(asset.assetTypeId)}
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-900 text-sm">{asset.name}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{asset.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-slate-600 font-bold">{asset.serialNumber}</td>
                                <td className="p-4">
                                  <span className="text-slate-600">{typeObj?.name || "Equipment"}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    asset.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                                    asset.status === "Allocated" ? "bg-indigo-50 text-indigo-700" : "bg-rose-50 text-rose-700"
                                  }`}>
                                    {asset.status}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-800">
                                  {assignedEmp ? (
                                    <div>
                                      <p className="font-bold">{assignedEmp.fullName}</p>
                                      <p className="text-[10px] text-slate-400 font-mono">{assignedEmp.id}</p>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-normal italic">None</span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(asset)}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition"
                                      title="Edit Asset"
                                    >
                                      <Edit className="size-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(asset.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                                      title="Delete Asset"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                              No assets match filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {managerTab === "types" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">Asset Categories & Types</h3>
                    <p className="text-[11px] text-slate-400">Define classification models for assets (e.g. Laptops, Mobiles, Furniture).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEditingType(null); setTypeName(""); setTypeModalOpen(true); }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-black text-white hover:bg-indigo-700 transition"
                  >
                    <Plus className="size-3.5" /> Add Type
                  </button>
                </div>
                <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Type ID</th>
                        <th className="p-4">Category Name</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {assetTypes.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono font-bold text-slate-500">TYPE-0{t.id}</td>
                          <td className="p-4 text-slate-900 font-black text-sm">{t.name}</td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => { setEditingType(t); setTypeName(t.name); setTypeModalOpen(true); }}
                                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                Edit
                              </button>
                              <span className="text-slate-200">|</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteType(t.id)}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {managerTab === "requests" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <h3 className="font-black text-slate-800 text-sm">IT Asset Allotment Requests</h3>
                  <p className="text-[11px] text-slate-400">Approve and fulfill equipment assignment requests generated automatically during employee onboarding.</p>
                </div>
                <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Employee</th>
                        <th className="p-4 font-mono">Date Submitted</th>
                        <th className="p-4">Comments</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {assetRequests.length > 0 ? (
                        assetRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <p className="font-black text-slate-900 text-sm">{req.employeeName}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{req.employeeId}</p>
                            </td>
                            <td className="p-4 font-mono text-slate-600">{req.date}</td>
                            <td className="p-4 text-slate-500 font-normal leading-relaxed">{req.comments}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === "Allocated" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {req.status === "Pending" ? (
                                <button
                                  type="button"
                                  onClick={() => handleAllotRequest(req)}
                                  className="rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 text-[10px] shadow-sm transition"
                                >
                                  Allot Asset
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic font-normal">Allotted ✓</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                            No IT allotment requests in the system.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}
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

              <h3 className="text-base font-black text-slate-900 mb-2">
                {editingAsset ? "Modify Asset Record" : "Add Asset to Inventory"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Define the asset name, type, serial key, and assign it to active corporate employees.
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
                    Asset Display Name
                    <input
                      type="text"
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                      placeholder="e.g. MacBook Pro M3"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Asset Type
                    <select
                      value={assetTypeId}
                      onChange={(e) => setAssetTypeId(Number(e.target.value))}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                    >
                      {assetTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Serial Number / Service Tag
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="e.g. MBP-9821-M3"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                      required
                    />
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Purchase Price (INR)
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 249000"
                      className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Status Lifecycle
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Allocated">Allocated</option>
                      <option value="Broken">Broken / Damaged</option>
                    </select>
                  </label>

                  <label className="grid gap-1 font-bold text-slate-500 uppercase">
                    Allocate To Employee
                    <select
                      value={assignedUserId}
                      onChange={(e) => {
                        setAssignedUserId(e.target.value);
                        if (e.target.value) {
                          setStatus("Allocated");
                        } else if (status === "Allocated") {
                          setStatus("Available");
                        }
                      }}
                      className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500"
                    >
                      <option value="">Unassigned (None)</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.id})</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Purchase/Allocation Date
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                  />
                </label>

                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Asset Notes & Specifications
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe configuration, RAM, accessories..."
                    className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none"
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
                    Save Asset
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Modal: Add/Edit Asset Type */}
        {typeModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-sm border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => setTypeModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">
                {editingType ? "Modify Asset Type" : "Add Asset Type"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">Define classification type for assets inventory.</p>
              <form onSubmit={handleSaveType} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">
                  Asset Type Name
                  <input
                    type="text"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="e.g. Tablets"
                    className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30"
                    required
                  />
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
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow"
                  >
                    Save Category
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
