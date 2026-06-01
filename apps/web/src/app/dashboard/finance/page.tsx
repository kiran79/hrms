"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Card, Badge } from "@/components/ui";
import { Search, Plus, X, Landmark, ArrowDownLeft, ArrowUpRight, Calendar, DollarSign, Tag, FileText } from "lucide-react";
import { defaultAccounts, defaultDeposits, defaultExpenses } from "@/lib/data";

function FinanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab state synced with query param ?tab=accounts/deposits/expenses
  const initialTab = searchParams.get("tab") || "accounts";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  // Modals visibility
  const [accountModal, setAccountModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  // Form states: Account
  const [accName, setAccName] = useState("");
  const [accNum, setAccNum] = useState("");
  const [accBranchCode, setAccBranchCode] = useState("");
  const [accBranchAddress, setAccBranchAddress] = useState("");
  const [accBalance, setAccBalance] = useState(0);

  // Form states: Deposit
  const [depAmount, setDepAmount] = useState(0);
  const [depAccountId, setDepAccountId] = useState<number>(1);
  const [depPayer, setDepPayer] = useState("");
  const [depNotes, setDepNotes] = useState("");
  const [depDate, setDepDate] = useState("");

  // Form states: Expense
  const [expAmount, setExpAmount] = useState(0);
  const [expAccountId, setExpAccountId] = useState<number>(1);
  const [expPayee, setExpPayee] = useState("");
  const [expNotes, setExpNotes] = useState("");
  const [expDate, setExpDate] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      // Load Accounts
      const storedAccounts = localStorage.getItem("hrms_accounts");
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      } else {
        localStorage.setItem("hrms_accounts", JSON.stringify(defaultAccounts));
        setAccounts(defaultAccounts);
      }

      // Load Deposits
      const storedDeposits = localStorage.getItem("hrms_deposits");
      if (storedDeposits) {
        setDeposits(JSON.parse(storedDeposits));
      } else {
        localStorage.setItem("hrms_deposits", JSON.stringify(defaultDeposits));
        setDeposits(defaultDeposits);
      }

      // Load Expenses
      const storedExpenses = localStorage.getItem("hrms_expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        localStorage.setItem("hrms_expenses", JSON.stringify(defaultExpenses));
        setExpenses(defaultExpenses);
      }
    }
  }, [router]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/finance?tab=${tab}` as any);
  };

  // Add Account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accName.trim() || !accNum.trim() || accBalance <= 0) {
      setError("Please fill out all mandatory fields.");
      return;
    }

    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const payload = {
      id: newId,
      name: accName,
      accountNumber: accNum,
      branchCode: accBranchCode,
      branchAddress: accBranchAddress,
      initialBalance: Number(accBalance),
      balance: Number(accBalance)
    };

    const updated = [...accounts, payload];
    setAccounts(updated);
    localStorage.setItem("hrms_accounts", JSON.stringify(updated));
    setSuccess("Bank account registered successfully!");
    setTimeout(() => setAccountModal(false), 800);
  };

  // Log Deposit
  const handleAddDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (depAmount <= 0 || !depPayer.trim() || !depDate) {
      setError("Please specify amount, payer, and deposit date.");
      return;
    }

    const newId = deposits.length > 0 ? Math.max(...deposits.map(d => d.id)) + 1 : 1;
    const payload = {
      id: newId,
      accountId: Number(depAccountId),
      depositCategoryId: 1,
      amount: Number(depAmount),
      dateTime: depDate + "T12:00:00",
      payerId: 1,
      payerName: depPayer,
      notes: depNotes
    };

    // Increase bank balance
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === Number(depAccountId)) {
        return { ...acc, balance: acc.balance + Number(depAmount) };
      }
      return acc;
    });

    const updatedDeposits = [payload, ...deposits];
    
    setAccounts(updatedAccounts);
    setDeposits(updatedDeposits);
    localStorage.setItem("hrms_accounts", JSON.stringify(updatedAccounts));
    localStorage.setItem("hrms_deposits", JSON.stringify(updatedDeposits));
    
    setSuccess("Deposit logged and bank balance credited!");
    setTimeout(() => setDepositModal(false), 800);
  };

  // Log Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (expAmount <= 0 || !expPayee.trim() || !expDate) {
      setError("Please specify amount, payee, and expense date.");
      return;
    }

    // Check account balance first
    const sourceAcc = accounts.find(a => a.id === Number(expAccountId));
    if (sourceAcc && sourceAcc.balance < Number(expAmount)) {
      setError(`Insufficient funds in HDFC account. Current: ₹${sourceAcc.balance.toLocaleString()}`);
      return;
    }

    const newId = expenses.length > 0 ? Math.max(...expenses.map(ex => ex.id)) + 1 : 1;
    const payload = {
      id: newId,
      accountId: Number(expAccountId),
      expenseCategoryId: 1,
      amount: Number(expAmount),
      dateTime: expDate + "T12:00:00",
      payeeName: expPayee,
      notes: expNotes,
      status: "Approved"
    };

    // Decrease bank balance
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === Number(expAccountId)) {
        return { ...acc, balance: acc.balance - Number(expAmount) };
      }
      return acc;
    });

    const updatedExpenses = [payload, ...expenses];
    
    setAccounts(updatedAccounts);
    setExpenses(updatedExpenses);
    localStorage.setItem("hrms_accounts", JSON.stringify(updatedAccounts));
    localStorage.setItem("hrms_expenses", JSON.stringify(updatedExpenses));
    
    setSuccess("Expense logged and bank balance debited!");
    setTimeout(() => setExpenseModal(false), 800);
  };

  // Filters
  const getFilteredItems = () => {
    const query = searchQuery.toLowerCase();
    if (activeTab === "accounts") {
      return accounts.filter(a => a.name.toLowerCase().includes(query) || a.accountNumber.includes(query));
    }
    if (activeTab === "deposits") {
      return deposits.filter(d => (d.payerName || "Client").toLowerCase().includes(query) || d.notes.toLowerCase().includes(query));
    }
    return expenses.filter(e => (e.payeeName || "Vendor").toLowerCase().includes(query) || e.notes.toLowerCase().includes(query));
  };

  const filteredItems = getFilteredItems();

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active={activeTab === "accounts" ? "Accounts" : activeTab === "deposits" ? "Deposits" : "Expenses"} />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Finance Ledger Book</h2>
            <p className="mt-1 text-sm text-slate-500">Monitor treasury, manage company cash deposits, and authorize team expenses.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={"/dashboard/reports?tab=finance" as any}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow hover:bg-slate-50 transition"
            >
              <FileText className="size-4 text-indigo-500" /> View Finance Reports
            </Link>
            {activeTab === "accounts" && (
              <button
                onClick={() => { setAccName(""); setAccNum(""); setAccBranchCode(""); setAccBranchAddress(""); setAccBalance(0); setError(null); setSuccess(null); setAccountModal(true); }}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-700 transition"
              >
                <Plus className="size-4" /> Add Account
              </button>
            )}
            {activeTab === "deposits" && (
              <button
                onClick={() => { setDepAmount(0); setDepPayer(""); setDepNotes(""); setDepDate(new Date().toISOString().split("T")[0]); setDepAccountId(accounts[0]?.id || 1); setError(null); setSuccess(null); setDepositModal(true); }}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-emerald-700 transition"
              >
                <Plus className="size-4" /> Log Deposit (Credit)
              </button>
            )}
            {activeTab === "expenses" && (
              <button
                onClick={() => { setExpAmount(0); setExpPayee(""); setExpNotes(""); setExpDate(new Date().toISOString().split("T")[0]); setExpAccountId(accounts[0]?.id || 1); setError(null); setSuccess(null); setExpenseModal(true); }}
                className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2.5 text-xs font-black text-white shadow hover:bg-rose-700 transition"
              >
                <Plus className="size-4" /> Log Expense (Debit)
              </button>
            )}
          </div>
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-bold text-slate-400">
          <button
            onClick={() => handleTabChange("accounts")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "accounts" ? "border-indigo-600 text-indigo-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Bank Accounts
          </button>
          <button
            onClick={() => handleTabChange("deposits")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "deposits" ? "border-emerald-600 text-emerald-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Deposits (Inflow Ledger)
          </button>
          <button
            onClick={() => handleTabChange("expenses")}
            className={`py-3 px-6 border-b-2 transition ${activeTab === "expenses" ? "border-rose-600 text-rose-600 font-extrabold" : "border-transparent hover:text-slate-700"}`}
          >
            Expenses (Outflow Ledger)
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Dynamic tab contents */}
        {activeTab === "accounts" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map(acc => (
              <Card key={acc.id} className="border-slate-200 p-5 bg-white shadow-sm hover:border-indigo-200 transition flex flex-col justify-between h-44">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                      <Landmark className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">{acc.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Acc: {acc.accountNumber}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 truncate font-normal">Branch: {acc.branchAddress || "Corporate Cash Vault"}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Balance</span>
                  <span className="text-lg font-black text-slate-800">₹{acc.balance?.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "deposits" && (
          <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Credit Details</th>
                    <th className="p-4 font-mono">Date</th>
                    <th className="p-4">Credited Account</th>
                    <th className="p-4">Payer / Source</th>
                    <th className="p-4 text-right">Inflow Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredItems.map((dep: any) => {
                    const acc = accounts.find(a => a.id === dep.accountId);
                    return (
                      <tr key={dep.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded text-emerald-600">
                              <ArrowDownLeft className="size-4" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm">Cash Inflow Deposit</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate font-normal">{dep.notes}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{dep.dateTime.split("T")[0]}</td>
                        <td className="p-4 text-slate-600 font-bold">{acc?.name || "Corporate Treasury"}</td>
                        <td className="p-4 text-slate-600">{dep.payerName || "Stripe Subscription Payment"}</td>
                        <td className="p-4 text-right text-emerald-600 font-black text-sm">
                          + ₹{dep.amount?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "expenses" && (
          <Card className="border-slate-200 shadow-sm overflow-hidden p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Debit Details</th>
                    <th className="p-4 font-mono">Date</th>
                    <th className="p-4">Source Account</th>
                    <th className="p-4">Payee / Vendor</th>
                    <th className="p-4">Approval</th>
                    <th className="p-4 text-right">Outflow Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredItems.map((exp: any) => {
                    const acc = accounts.find(a => a.id === exp.accountId);
                    return (
                      <tr key={exp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 rounded text-rose-600">
                              <ArrowUpRight className="size-4" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm">Operating Debit Expense</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate font-normal">{exp.notes}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{exp.dateTime.split("T")[0]}</td>
                        <td className="p-4 text-slate-600 font-bold">{acc?.name || "Corporate HDFC"}</td>
                        <td className="p-4 text-slate-600">{exp.payeeName || "Vendor Payout"}</td>
                        <td className="p-4">
                          <Badge>{exp.status || "Approved"}</Badge>
                        </td>
                        <td className="p-4 text-right text-rose-600 font-black text-sm">
                          - ₹{exp.amount?.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* MODAL: Account Registration */}
        {accountModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setAccountModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">Register Bank Account</h3>
              <p className="text-xs text-slate-400 mb-4">Add a company account, bank code, and opening ledger balances.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleAddAccount} className="space-y-4 text-xs">
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Bank Display Name<input type="text" value={accName} onChange={e => setAccName(e.target.value)} placeholder="e.g. HDFC Salary Account" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Account Number<input type="text" value={accNum} onChange={e => setAccNum(e.target.value)} placeholder="e.g. 502000459281" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">IFS Code / Branch Code<input type="text" value={accBranchCode} onChange={e => setAccBranchCode(e.target.value)} placeholder="HDFC0000104" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Opening Balance (INR)<input type="number" value={accBalance} onChange={e => setAccBalance(Number(e.target.value))} placeholder="1500000" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                </div>
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Branch Address Address<input type="text" value={accBranchAddress} onChange={e => setAccBranchAddress(e.target.value)} placeholder="MG Road branch, Bangalore" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" /></label>
                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setAccountModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Save Account</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Log Inflow Deposit */}
        {depositModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setDepositModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">Record Inflow Deposit</h3>
              <p className="text-xs text-slate-400 mb-4">Log customer cash inflow or funding credits. Target bank balances increase.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleAddDeposit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Deposit Amount (INR)<input type="number" value={depAmount} onChange={e => setDepAmount(Number(e.target.value))} placeholder="150000" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Target Account<select value={depAccountId} onChange={e => setDepAccountId(Number(e.target.value))} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500">{accounts.map(a => (<option key={a.id} value={a.id}>{a.name} (Bal: ₹{a.balance})</option>))}</select></label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Payer / Source Client<input type="text" value={depPayer} onChange={e => setDepPayer(e.target.value)} placeholder="e.g. Acme Client Corp" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Deposit Date<input type="date" value={depDate} onChange={e => setDepDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                </div>
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Inflow Notes<textarea value={depNotes} onChange={e => setDepNotes(e.target.value)} placeholder="Invoice details, tax reference code..." className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none" /></label>
                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setDepositModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Log Deposit</button></div>
              </form>
            </Card>
          </div>
        )}

        {/* MODAL: Log Outflow Expense */}
        {expenseModal && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button onClick={() => setExpenseModal(false)} className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="size-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 mb-2">Record Outflow Expense</h3>
              <p className="text-xs text-slate-400 mb-4">Log AWS charges, rent, or vendor invoices. Source bank balances decrease.</p>
              {error && <div className="mb-4 rounded-md bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-100">{error}</div>}
              {success && <div className="mb-4 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-100 animate-pulse">{success}</div>}
              <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Expense Amount (INR)<input type="number" value={expAmount} onChange={e => setExpAmount(Number(e.target.value))} placeholder="25000" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Source Account<select value={expAccountId} onChange={e => setExpAccountId(Number(e.target.value))} className="h-10 rounded border border-slate-200 px-3 bg-white outline-none focus:border-indigo-500">{accounts.map(a => (<option key={a.id} value={a.id}>{a.name} (Bal: ₹{a.balance})</option>))}</select></label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Payee / Vendor Name<input type="text" value={expPayee} onChange={e => setExpPayee(e.target.value)} placeholder="e.g. AWS Cloud Web" className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                  <label className="grid gap-1 font-bold text-slate-500 uppercase">Expense Date<input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} className="h-10 rounded border border-slate-200 px-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30" required /></label>
                </div>
                <label className="grid gap-1 font-bold text-slate-500 uppercase">Debit Notes<textarea value={expNotes} onChange={e => setExpNotes(e.target.value)} placeholder="Describe expense, add reference receipt keys..." className="h-20 rounded border border-slate-200 p-3 font-normal outline-none focus:border-indigo-500 bg-slate-50/30 resize-none" /></label>
                <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setExpenseModal(false)} className="rounded border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button><button type="submit" className="rounded bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 font-bold text-white shadow">Log Expense</button></div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-semibold bg-slate-50 min-h-screen">Loading Finance Ledger...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
