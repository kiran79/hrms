"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SaasSidebar } from "@/components/app/saas-sidebar";
import { Badge, Card } from "@/components/ui";
import {
  Banknote,
  Bell,
  Bot,
  CalendarCheck,
  FileText,
  ShieldAlert,
  UsersRound,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ThumbsUp,
  Briefcase,
  Gift,
  Award,
  DollarSign,
  Laptop,
  Landmark,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { defaultAttendances, defaultLeaveTypes, defaultLeaves, defaultExpenses, defaultHolidays } from "@/lib/data";

const defaultEmployees = [
  {
    id: "EMP-001",
    fullName: "Admin User",
    email: "admin@example.com",
    mobile: "9876543210",
    pan: "ABCDE1234F",
    aadhaar: "123456789012",
    uan: "100987654321",
    esicNumber: "31123456780010101",
    department: "Administration",
    designation: "CEO",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2020-01-15",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 120000,
      hra: 60000,
      specialAllowance: 50000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    }
  },
  {
    id: "EMP-002",
    fullName: "Levi O'Kon DVM",
    email: "levi@example.com",
    mobile: "9876543211",
    pan: "FGHIJ5678K",
    aadhaar: "234567890123",
    uan: "100987654322",
    esicNumber: "31123456780010102",
    department: "Operations",
    designation: "Contracts Manager",
    branch: "Pune",
    location: "Maharashtra",
    dateOfJoining: "2024-05-10",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 50000,
      hra: 25000,
      specialAllowance: 20000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    }
  },
  {
    id: "EMP-003",
    fullName: "Forrest Fadel",
    email: "forrest@example.com",
    mobile: "9876543212",
    pan: "LMNOP9012Q",
    aadhaar: "345678901234",
    uan: "100987654323",
    esicNumber: "31123456780010103",
    department: "Sales & Marketing",
    designation: "Sales Director",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2022-09-01",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 80000,
      hra: 40000,
      specialAllowance: 30000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    }
  },
  {
    id: "EMP-004",
    fullName: "Dr. Jonas Stiedemann",
    email: "jonas@example.com",
    mobile: "9876543213",
    pan: "RSTUV3456W",
    aadhaar: "456789012345",
    uan: "100987654324",
    esicNumber: "31123456780010104",
    department: "Research & Development",
    designation: "Lead Architect",
    branch: "Bengaluru",
    location: "Karnataka",
    dateOfJoining: "2023-03-20",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 95000,
      hra: 47500,
      specialAllowance: 35000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 5000
    }
  },
  {
    id: "EMP-005",
    fullName: "Berry Little",
    email: "berry@example.com",
    mobile: "9876543214",
    pan: "XYZAB7890C",
    aadhaar: "567890123456",
    uan: "100987654325",
    esicNumber: "31123456780010105",
    department: "Administration",
    designation: "Office Assistant",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2025-01-10",
    employmentType: "FULL_TIME",
    probationDays: 180,
    salary: {
      basic: 18000,
      hra: 9000,
      specialAllowance: 5000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 0
    }
  },
  {
    id: "EMP-006",
    fullName: "Dakota Heathcote",
    email: "dakota@example.com",
    mobile: "9876543215",
    pan: "DEFGH1234J",
    aadhaar: "678901234567",
    uan: "100987654326",
    esicNumber: "31123456780010106",
    department: "Finance",
    designation: "Corporate Lawyer",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2024-06-15",
    employmentType: "FULL_TIME",
    probationDays: 90,
    salary: {
      basic: 60000,
      hra: 30000,
      specialAllowance: 25000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    }
  },
  {
    id: "EMP-007",
    fullName: "Ciara Glover",
    email: "ciara@example.com",
    mobile: "9876543216",
    pan: "KLMNO5678P",
    aadhaar: "789012345678",
    uan: "100987654327",
    esicNumber: "31123456780010107",
    department: "Production",
    designation: "Production Manager",
    branch: "Pune",
    location: "Maharashtra",
    dateOfJoining: "2025-02-01",
    employmentType: "CONTRACT",
    clientName: "Google India Pvt Ltd",
    workLocation: "Google Signature Towers, Gurugram",
    probationDays: 90,
    salary: {
      basic: 45000,
      hra: 22500,
      specialAllowance: 18000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 3000
    }
  },
  {
    id: "EMP-008",
    fullName: "Pooja Hegde",
    email: "pooja.h@example.com",
    mobile: "9876543217",
    pan: "QRSTU9012V",
    aadhaar: "890123456789",
    uan: "100987654328",
    esicNumber: "31123456780010108",
    department: "Human Resources",
    designation: "HR Lead",
    branch: "Mumbai",
    location: "Maharashtra",
    dateOfJoining: "2021-08-01",
    employmentType: "FULL_TIME",
    probationDays: 0,
    salary: {
      basic: 55000,
      hra: 27500,
      specialAllowance: 22000,
      conveyance: 1600,
      medicalAllowance: 1250,
      lta: 4000
    }
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("Hrmifly SaaS");
  const [domain, setDomain] = useState("hrmifly.codeifly.in");
  const [loading, setLoading] = useState(true);

  // Perspective states
  const [viewMode, setViewMode] = useState<"self" | "manager">("manager");

  // Holiday Calendar states
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [allHolidays, setAllHolidays] = useState<any[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("admin@example.com");
  const [currentUserEmpId, setCurrentUserEmpId] = useState("EMP-001");
  const [currentUserFullName, setCurrentUserFullName] = useState("Admin User");
  const [currentUserDesignation, setCurrentUserDesignation] = useState("CEO");
  const [currentUserDepartment, setCurrentUserDepartment] = useState("Administration");
  const [attendances, setAttendances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<any[]>([]);

  // Personal statistics (Self View)
  const [personalLeaveBalance, setPersonalLeaveBalance] = useState(18);
  const [personalExpenseClaimed, setPersonalExpenseClaimed] = useState(0);
  const [personalAppreciationsCount, setPersonalAppreciationsCount] = useState(0);

  // Attendance metrics (Manager View)
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [presentCount, setPresentCount] = useState(0);
  const [notMarkedCount, setNotMarkedCount] = useState(22);
  const [totalActive, setTotalActive] = useState(22);
  const [totalEmployeesCount, setTotalEmployeesCount] = useState(35);
  const [totalInactiveCount, setTotalInactiveCount] = useState(13);

  // Dynamic Lists
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [personalLeavesList, setPersonalLeavesList] = useState<any[]>([]);
  const [personalExpensesList, setPersonalExpensesList] = useState<any[]>([]);

  // Static items for layout widgets
  const departmentCounts = [
    { name: "Customer Support", count: 5 },
    { name: "Administration", count: 4 },
    { name: "Research & Development", count: 3 },
    { name: "Human Resources", count: 3 },
    { name: "Production", count: 3 },
    { name: "IT Department", count: 2 },
    { name: "Operations", count: 4 },
    { name: "Finance", count: 2 },
    { name: "Sales & Marketing", count: 9 }
  ];

  const promotions = [
    { name: "Dakota Heathcote", type: "promotion", text: "Promoted to Corporate Lawyer", desc: "Laborum quod ut incidunt.", date: "27 May 2026" },
    { name: "Levi O'Kon DVM", type: "promotion", text: "Promoted to Production Manager", desc: "Voluptatem ea eos aspernatur.", date: "26 May 2026" },
    { name: "Admin User", type: "increment", text: "Salary Increment of ₹30,000", desc: "Quidem dolorem sed culpa itaque.", date: "15 Apr 2026" }
  ];

  const birthdays = [
    { name: "Levi O'Kon DVM", designation: "Contracts Manager", date: "4 January" },
    { name: "Forrest Fadel", designation: "Sales Director", date: "12 February" },
    { name: "Pooja Hegde", designation: "HR Lead", date: "18 June" }
  ];

  const anniversaries = [
    { name: "Ciara Glover", designation: "Production Manager", count: "1st", date: "2 June" },
    { name: "Berry Little", designation: "Office Assistant", count: "2nd", date: "15 July" },
    { name: "Admin User", designation: "Chief Executive", count: "11th", date: "30 July" }
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("session_user_type");
      const companyStr = localStorage.getItem("session_company");
      
      if (userType !== "company") {
        router.push("/login?tab=company");
        return;
      }

      if (companyStr) {
        try {
          const company = JSON.parse(companyStr);
          setCompanyName(company.name || "Hrmifly SaaS");
          setDomain(company.domain || "hrmifly.codeifly.in");
        } catch (e) {
          console.error("Error parsing session_company:", e);
        }
      }

      // Load view mode
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);

      // Load employees
      let parsedEmployees = defaultEmployees;
      const storedEmp = localStorage.getItem("employees");
      if (storedEmp) {
        parsedEmployees = JSON.parse(storedEmp);
      } else {
        localStorage.setItem("employees", JSON.stringify(defaultEmployees));
      }
      setEmployees(parsedEmployees);

      // Load current user context
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      setCurrentUserEmail(email);

      const matchedEmp = parsedEmployees.find(e => e.email.toLowerCase() === email.toLowerCase());
      const empId = matchedEmp ? matchedEmp.id : "EMP-001";
      const fullName = matchedEmp ? matchedEmp.fullName : "Admin User";
      const designation = matchedEmp ? matchedEmp.designation : "CEO";
      const dept = matchedEmp ? matchedEmp.department : "Administration";

      setCurrentUserEmpId(empId);
      setCurrentUserFullName(fullName);
      setCurrentUserDesignation(designation);
      setCurrentUserDepartment(dept);

      // Load attendances
      let parsedAttendances = defaultAttendances;
      const storedAtt = localStorage.getItem("hrms_attendances");
      if (storedAtt) {
        parsedAttendances = JSON.parse(storedAtt);
      } else {
        localStorage.setItem("hrms_attendances", JSON.stringify(defaultAttendances));
      }
      setAttendances(parsedAttendances);

      // Check current user clock-in status today
      const todayStr = new Date().toISOString().split("T")[0];
      const todayRec = parsedAttendances.find(a => a.userId === empId && a.date === todayStr);
      if (todayRec) {
        setIsClockedIn(!!todayRec.clockInDateTime && !todayRec.clockOutDateTime);
        if (todayRec.clockInDateTime) {
          const t = new Date(todayRec.clockInDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setClockInTime(t);
        } else {
          setClockInTime(null);
        }
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
      }

      // Calculate attendance statistics today for active employees
      const presentTodayIds = new Set(
        parsedAttendances
          .filter(a => a.date === todayStr && a.clockInDateTime)
          .map(a => a.userId)
      );

      const activeCount = parsedEmployees.length;
      setTotalActive(activeCount);
      setTotalEmployeesCount(Math.max(35, activeCount + 13));
      setTotalInactiveCount(Math.max(13, 35 - activeCount));

      const presentC = presentTodayIds.size;
      setPresentCount(presentC);
      setNotMarkedCount(Math.max(0, activeCount - presentC));

      // Build checklist
      const checklist = parsedEmployees.map(emp => {
        const hasClockedIn = presentTodayIds.has(emp.id);
        return {
          name: emp.fullName,
          role: emp.designation,
          status: hasClockedIn ? "present" : "not_marked"
        };
      });
      setStaffMembers(checklist);

      // Load leaves list for approvals
      const storedLeaves = localStorage.getItem("hrms_leaves");
      const leaves = storedLeaves ? JSON.parse(storedLeaves) : defaultLeaves;
      const storedTypes = localStorage.getItem("hrms_leave_types");
      const types = storedTypes ? JSON.parse(storedTypes) : defaultLeaveTypes;

      const pendingL = leaves.filter((l: any) => l.status === "Pending");
      const leavesList = pendingL.map((l: any) => {
        const emp = parsedEmployees.find((e: any) => e.id === l.userId);
        const type = types.find((t: any) => t.id === l.leaveTypeId);
        const typeName = type ? type.name : "Leave";
        return {
          name: emp ? emp.fullName : "Unknown Employee",
          reason: l.reason || `${typeName} request`,
          date: l.startDate === l.endDate ? l.startDate : `${l.startDate} to ${l.endDate}`,
          duration: `${l.totalDays} Day${l.totalDays > 1 ? "s" : ""}`
        };
      });

      if (leavesList.length === 0) {
        setPendingLeaves([
          { name: "Levi O'Kon DVM", reason: "Personal family leave request", date: "22 Jan 2026", duration: "1 Day" },
          { name: "Dakota Heathcote", reason: "Statutory medical checkup leaves", date: "23 Jan 2026", duration: "1 Day" }
        ]);
      } else {
        setPendingLeaves(leavesList);
      }

      // Load expenses list for approvals
      const storedExpenses = localStorage.getItem("hrms_expenses");
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : defaultExpenses;
      const pendingE = expenses.filter((e: any) => e.status === "Pending");
      const expenseList = pendingE.map((e: any) => ({
        name: e.payeeName || "Unknown Payee",
        ref: e.referenceNumber || `EXP-${e.id}`,
        notes: e.notes || "Business expense claim",
        amount: e.amount,
        date: e.dateTime ? new Date(e.dateTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Today"
      }));

      if (expenseList.length === 0) {
        setPendingExpenses([
          { name: "Ciara Glover", ref: "EXP-6A18E6A8CAC", notes: "Caterpillar client business dinner catering", amount: 459, date: "29 Apr 2026" },
          { name: "Berry Little", ref: "EXP-7D21C9B9ABC", notes: "Office stationeries and printer ink refills", amount: 1200, date: "27 Apr 2026" }
        ]);
      } else {
        setPendingExpenses(expenseList);
      }

      // Compute Self (ESS) personal leave balance
      const approvedUserLeaves = leaves.filter((l: any) => l.userId === empId && l.status === "Approved");
      const allocatedLeaves = types.reduce((acc: number, t: any) => acc + (t.totalLeaves || 0), 0);
      const takenLeaves = approvedUserLeaves.reduce((acc: number, l: any) => acc + (l.totalDays || 0), 0);
      setPersonalLeaveBalance(Math.max(0, allocatedLeaves - takenLeaves));

      // Compute Self personal claims sum
      const myExpenses = expenses.filter((e: any) => {
        const payee = (e.payeeName || "").toLowerCase();
        const userName = fullName.toLowerCase();
        return payee.includes(userName) || payee === userName;
      });
      const totalClaimed = myExpenses.reduce((acc: number, e: any) => acc + Number(e.amount), 0);
      setPersonalExpenseClaimed(totalClaimed);

      // Compute Self appreciations count
      const storedAppr = localStorage.getItem("hrms_appreciations") || localStorage.getItem("hrms_awards");
      const appreciations = storedAppr ? JSON.parse(storedAppr) : [];
      setPersonalAppreciationsCount(appreciations.filter((a: any) => a.userId === empId).length);

      // Self lists: personal leaves list
      const myLeaves = leaves.filter((l: any) => l.userId === empId);
      const personalLeaves = myLeaves.map((l: any) => {
        const type = types.find((t: any) => t.id === l.leaveTypeId);
        const typeName = type ? type.name : "Leave";
        return {
          typeName,
          dateRange: l.startDate === l.endDate ? l.startDate : `${l.startDate} to ${l.endDate}`,
          totalDays: l.totalDays,
          status: l.status
        };
      });
      setPersonalLeavesList(personalLeaves);

      // Self lists: personal expenses list
      const personalExpenses = expenses.filter((e: any) => {
        const payee = (e.payeeName || "").toLowerCase();
        const userName = fullName.toLowerCase();
        return payee.includes(userName) || payee === userName;
      }).map((e: any) => ({
        notes: e.notes || "Business expense claim",
        amount: e.amount,
        date: e.dateTime ? new Date(e.dateTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Today",
        status: e.status || "Approved"
      }));
      setPersonalExpensesList(personalExpenses);

      // Load holidays list
      const storedHolidays = localStorage.getItem("hrms_holidays");
      if (storedHolidays) {
        setAllHolidays(JSON.parse(storedHolidays));
      } else {
        localStorage.setItem("hrms_holidays", JSON.stringify(defaultHolidays));
        setAllHolidays(defaultHolidays);
      }

      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncState = () => {
      const email = localStorage.getItem("session_company_email") || "admin@example.com";
      const storedEmp = localStorage.getItem("employees");
      const parsedEmployees = storedEmp ? JSON.parse(storedEmp) : defaultEmployees;
      const matchedEmp = parsedEmployees.find((e: any) => e.email.toLowerCase() === email.toLowerCase());
      const empId = matchedEmp ? matchedEmp.id : "EMP-001";
      const fullName = matchedEmp ? matchedEmp.fullName : "Admin User";

      // Load view mode
      const savedMode = (localStorage.getItem("session_view_mode") as any) || "manager";
      setViewMode(savedMode);

      // Load attendances
      const storedAtt = localStorage.getItem("hrms_attendances");
      const parsedAttendances = storedAtt ? JSON.parse(storedAtt) : defaultAttendances;
      setAttendances(parsedAttendances);

      // Check current user clock-in status today
      const todayStr = new Date().toISOString().split("T")[0];
      const todayRec = parsedAttendances.find((a: any) => a.userId === empId && a.date === todayStr);
      if (todayRec) {
        setIsClockedIn(!!todayRec.clockInDateTime && !todayRec.clockOutDateTime);
        if (todayRec.clockInDateTime) {
          const t = new Date(todayRec.clockInDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setClockInTime(t);
        } else {
          setClockInTime(null);
        }
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
      }

      // Recalculate present counts
      const presentTodayIds = new Set(
        parsedAttendances
          .filter((a: any) => a.date === todayStr && a.clockInDateTime)
          .map((a: any) => a.userId)
      );

      const activeCount = parsedEmployees.length;
      setTotalActive(activeCount);
      setTotalEmployeesCount(Math.max(35, activeCount + 13));
      setTotalInactiveCount(Math.max(13, 35 - activeCount));

      const presentC = presentTodayIds.size;
      setPresentCount(presentC);
      setNotMarkedCount(Math.max(0, activeCount - presentC));

      // Build checklist
      const checklist = parsedEmployees.map((emp: any) => {
        const hasClockedIn = presentTodayIds.has(emp.id);
        return {
          name: emp.fullName,
          role: emp.designation,
          status: hasClockedIn ? "present" : "not_marked"
        };
      });
      setStaffMembers(checklist);
      
      // Update self claims & balance
      const storedLeaves = localStorage.getItem("hrms_leaves");
      const leaves = storedLeaves ? JSON.parse(storedLeaves) : defaultLeaves;
      const storedTypes = localStorage.getItem("hrms_leave_types");
      const types = storedTypes ? JSON.parse(storedTypes) : defaultLeaveTypes;
      const approvedUserLeaves = leaves.filter((l: any) => l.userId === empId && l.status === "Approved");
      const allocatedLeaves = types.reduce((acc: number, t: any) => acc + (t.totalLeaves || 0), 0);
      const takenLeaves = approvedUserLeaves.reduce((acc: number, l: any) => acc + (l.totalDays || 0), 0);
      setPersonalLeaveBalance(Math.max(0, allocatedLeaves - takenLeaves));

      const storedExpenses = localStorage.getItem("hrms_expenses");
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : defaultExpenses;
      const myExpenses = expenses.filter((e: any) => {
        const payee = (e.payeeName || "").toLowerCase();
        const userName = fullName.toLowerCase();
        return payee.includes(userName) || payee === userName;
      });
      const totalClaimed = myExpenses.reduce((acc: number, e: any) => acc + Number(e.amount), 0);
      setPersonalExpenseClaimed(totalClaimed);

      // Update lists
      const myLeaves = leaves.filter((l: any) => l.userId === empId);
      setPersonalLeavesList(myLeaves.map((l: any) => {
        const type = types.find((t: any) => t.id === l.leaveTypeId);
        const typeName = type ? type.name : "Leave";
        return {
          typeName,
          dateRange: l.startDate === l.endDate ? l.startDate : `${l.startDate} to ${l.endDate}`,
          totalDays: l.totalDays,
          status: l.status
        };
      }));

      setPersonalExpensesList(expenses.filter((e: any) => {
        const payee = (e.payeeName || "").toLowerCase();
        const userName = fullName.toLowerCase();
        return payee.includes(userName) || payee === userName;
      }).map((e: any) => ({
        notes: e.notes || "Business expense claim",
        amount: e.amount,
        date: e.dateTime ? new Date(e.dateTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Today",
        status: e.status || "Approved"
      })));

      const storedHolidays = localStorage.getItem("hrms_holidays");
      if (storedHolidays) {
        setAllHolidays(JSON.parse(storedHolidays));
      } else {
        setAllHolidays(defaultHolidays);
      }
    };

    window.addEventListener("viewModeChanged", syncState);
    window.addEventListener("attendanceChanged", syncState);
    return () => {
      window.removeEventListener("viewModeChanged", syncState);
      window.removeEventListener("attendanceChanged", syncState);
    };
  }, [attendances, employees, currentUserEmpId, currentUserFullName]);

  const handleClockToggle = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const nowStr = new Date().toISOString();
    
    let updatedAttendances = [...attendances];
    
    if (isClockedIn) {
      // Clock Out
      const todayRec = updatedAttendances.find(a => a.userId === currentUserEmpId && a.date === todayStr);
      if (todayRec) {
        todayRec.clockOutDateTime = nowStr;
        todayRec.clockOutIpAddress = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
        todayRec.clockOutLatitude = todayRec.clockInLatitude;
        todayRec.clockOutLongitude = todayRec.clockInLongitude;
        todayRec.clockOutLocationName = todayRec.clockInLocationName;
      }
      setIsClockedIn(false);
      setClockInTime(null);
    } else {
      // Clock In
      const lat = 19.0760 + (Math.random() - 0.5) * 0.01;
      const lng = 72.8777 + (Math.random() - 0.5) * 0.01;
      const ip = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
      
      const newRecord = {
        id: updatedAttendances.length > 0 ? Math.max(...updatedAttendances.map(a => a.id)) + 1 : 1,
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
      updatedAttendances = [newRecord, ...updatedAttendances];
      setIsClockedIn(true);
      setClockInTime(new Date(nowStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    
    setAttendances(updatedAttendances);
    localStorage.setItem("hrms_attendances", JSON.stringify(updatedAttendances));
    
    // Dispatch events to keep pages synced
    window.dispatchEvent(new Event("attendanceChanged"));
  };

  const renderHolidayCalendar = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Previous month total days to fill starting offset empty days
    const prevMonthTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const days = [];
    // Fill empty slots with previous month days (represented as muted or empty)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: prevMonthTotalDays - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Next month days to pad to a multiple of 7
    const remainingDays = 42 - days.length; // 6 rows of 7
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    // Filter holidays for the selected month and year
    const monthHolidays = allHolidays.filter((h: any) => {
      if (!h.date) return false;
      const hDate = new Date(h.date);
      return hDate.getMonth() === calendarMonth && hDate.getFullYear() === calendarYear;
    });

    const handlePrevMonth = () => {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(calendarYear - 1);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(calendarYear + 1);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    };

    return (
      <Card className="border-slate-200 shadow-sm p-5 bg-white">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Calendar className="size-5 text-rose-500 shrink-0 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">Holiday Calendar (Month wise)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 transition font-bold text-xs"
              title="Previous Month"
            >
              &larr; Prev
            </button>
            <span className="text-xs font-black text-slate-800 min-w-[120px] text-center bg-indigo-50/50 py-1 px-3 rounded-full border border-indigo-100/50">
              {monthNames[calendarMonth]} {calendarYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 transition font-bold text-xs"
              title="Next Month"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Calendar Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((item, idx) => {
                let isHoliday = false;
                let holidayInfo: any = null;

                if (item.isCurrentMonth) {
                  // Format date to match YYYY-MM-DD
                  const dStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;
                  holidayInfo = allHolidays.find((h: any) => h.date === dStr);
                  isHoliday = !!holidayInfo;
                }

                return (
                  <div
                    key={idx}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-md border text-xs font-bold transition duration-205 group ${
                      !item.isCurrentMonth
                        ? "bg-slate-50/20 border-transparent text-slate-300 pointer-events-none"
                        : isHoliday
                        ? "bg-rose-50 border-rose-250 text-rose-700 font-black shadow-sm ring-1 ring-rose-200/50 cursor-pointer"
                        : "bg-white border-slate-100 text-slate-700 hover:border-indigo-200"
                    }`}
                  >
                    <span>{item.day}</span>
                    {isHoliday && (
                      <>
                        <span className="absolute bottom-1 size-1.5 rounded-full bg-rose-500 animate-ping" />
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-48 p-2.5 bg-slate-900 text-white text-[10px] font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition z-50 text-center leading-normal">
                          <p className="font-extrabold text-rose-300">{holidayInfo.name}</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">{holidayInfo.isHalfDay ? "Half Day Holiday" : "Full Day Public Holiday"}</p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Holidays list for the month */}
          <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Holidays in {monthNames[calendarMonth]}</h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {monthHolidays.length > 0 ? (
                  monthHolidays.map((h: any) => {
                    const dateObj = new Date(h.date);
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
                    return (
                      <div key={h.id} className="p-2.5 rounded-md border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition flex items-start gap-2.5">
                        <div className="p-1.5 bg-rose-50 rounded text-rose-600 mt-0.5">
                          <Calendar className="size-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 leading-tight">{h.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{h.date} • {dayName}</p>
                          <Badge className={`mt-1.5 text-[8px] ${h.isHalfDay ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
                            {h.isHalfDay ? "Half Day" : "Public Holiday"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No holidays scheduled in this month.</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>Total Holidays in {monthNames[calendarMonth]}:</span>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{monthHolidays.length}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderSelfDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Employee Self-Service (ESS)</span>
              <span className="h-4 border-l border-slate-300" />
              <span className="text-xs font-bold text-slate-500 font-mono">Workspace: {domain}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Welcome Back, {currentUserFullName}</h2>
            <p className="mt-1 text-sm text-slate-500">{currentUserDesignation} • {currentUserDepartment}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              Timezone: Asia/Kolkata
            </span>
          </div>
        </header>

        {/* ESS Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-indigo-50 text-indigo-600 shrink-0 ml-4">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Shift</p>
              <p className="text-sm font-black text-slate-900 mt-1">09:30 AM - 06:00 PM</p>
            </div>
          </Card>
          
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-emerald-50 text-emerald-600 shrink-0 ml-4">
              <CalendarCheck className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Balance</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{personalLeaveBalance} Days</p>
            </div>
          </Card>
          
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-blue-50 text-blue-600 shrink-0 ml-4">
              <Banknote className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claims Lodged</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">₹{personalExpenseClaimed.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-amber-50 text-amber-600 shrink-0 ml-4">
              <Award className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Appreciations</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{personalAppreciationsCount} Received</p>
            </div>
          </Card>
        </div>

        {/* ESS Row 1: Punch Console & Geofence Telemetry */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <Card className="border-slate-200 p-6 flex flex-col justify-between h-72 bg-white shadow-sm">
            <div>
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2 mb-1">
                <Clock className="size-4 text-indigo-500 animate-spin" /> Attendance Console
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Current shift: General Shift</span>
            </div>

            <div className="my-4 text-center">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </p>
            </div>

            {!isClockedIn ? (
              <button
                onClick={handleClockToggle}
                className="w-full rounded bg-indigo-600 hover:bg-indigo-750 transition py-3 font-black text-white shadow text-xs uppercase tracking-wider hover:bg-indigo-700"
              >
                Clock In Now
              </button>
            ) : (
              <button
                onClick={handleClockToggle}
                className="w-full rounded bg-rose-600 hover:bg-rose-700 transition py-3 font-black text-white shadow text-xs uppercase tracking-wider animate-pulse"
              >
                Clock Out Now
              </button>
            )}
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm bg-white flex flex-col justify-between">
            <div>
              <h4 className="font-black text-sm text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <MapPin className="size-4 text-indigo-500" /> Active Punch Geolocation
              </h4>
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-3">
                  {isClockedIn ? `Clocked-in today at ${clockInTime}` : "You have not checked-in today."}
                </p>
                {isClockedIn && (
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Punch Location</span>
                        <span className="font-bold text-slate-800">Mumbai Corporate Office (Punch)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Telemetry Branch Accuracy</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="size-3.5" /> 98.4% (Within Geofence)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 bg-slate-50 border border-slate-100 p-3 rounded">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Mock Coordinate Locking</span>
                        <span className="font-bold text-slate-800 font-mono text-[10px] block mt-0.5">Lat: 19.076000</span>
                        <span className="font-bold text-slate-800 font-mono text-[10px] block">Lng: 72.877700</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
              <Link href="/dashboard/attendance" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">
                View Timesheet History →
              </Link>
            </div>
          </Card>
        </div>

        {/* ESS Row 2: My Request Histories */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-slate-200 shadow-sm p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CalendarCheck className="size-4 text-emerald-500" /> My Leave Requests
                </h3>
                <Link href="/dashboard/leaves" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition">
                  Apply Leave →
                </Link>
              </div>
              <div className="space-y-3">
                {personalLeavesList.length > 0 ? (
                  personalLeavesList.slice(0, 4).map((l, index) => (
                    <div key={index} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{l.typeName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{l.dateRange}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-semibold">{l.totalDays} Days</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          l.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {l.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No recent leave requests.</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Banknote className="size-4 text-blue-500" /> My Expense Claims
                </h3>
                <Link href="/dashboard/finance?tab=expenses" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition">
                  Claim Expense →
                </Link>
              </div>
              <div className="space-y-3">
                {personalExpensesList.length > 0 ? (
                  personalExpensesList.slice(0, 4).map((e, index) => (
                    <div key={index} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{e.notes}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{e.date}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">₹{e.amount.toLocaleString()}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          e.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          e.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No recent expense claims.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* ESS Row 3: Holiday Calendar */}
        {renderHolidayCalendar()}
      </div>
    );
  };

  const renderManagerDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white -mx-6 -mt-6 p-6 lg:-mx-8 lg:-mt-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Admin Command Center</span>
              <span className="h-4 border-l border-slate-300" />
              <span className="text-xs font-bold text-slate-500 font-mono">Workspace: {domain}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{companyName} Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">Live operational stats, employee records, attendance rosters, and pending clearances.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              Timezone: Asia/Kolkata
            </span>
          </div>
        </header>

        {/* Top level stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-blue-50 text-blue-600 shrink-0 ml-4">
              <UsersRound className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalEmployeesCount}</p>
            </div>
          </Card>
          
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-emerald-50 text-emerald-600 shrink-0 ml-4">
              <span className="size-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Employees</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalActive}</p>
            </div>
          </Card>
          
          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-slate-100 text-slate-500 shrink-0 ml-4">
              <span className="size-3 rounded-full bg-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive Employees</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalInactiveCount}</p>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm flex items-center gap-4 py-4 bg-white">
            <div className="grid size-12 place-items-center rounded bg-indigo-50 text-indigo-600 shrink-0 ml-4">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office Timings</p>
              <p className="text-sm font-black text-slate-900 mt-1">09:30 AM - 06:00 PM</p>
            </div>
          </Card>
        </div>

        {/* Row 1: Attendance SVG Donut & Pending Items */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* Donut Chart / Interactive Clock In */}
          <Card className="border-slate-200 shadow-sm flex flex-col justify-between bg-white p-5">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Today's Attendance</h3>
                <Badge>Roster Ratios</Badge>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 items-center">
                {/* SVG Donut */}
                <div className="relative flex justify-center">
                  <svg className="w-36 h-36" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" cx="18" cy="18" r="15.915" />
                    
                    {/* Not Marked Segment (Orange) */}
                    <circle
                      className="text-amber-500 transition-all duration-500"
                      strokeWidth="3.8"
                      strokeDasharray={`${(notMarkedCount / totalActive) * 100} ${100 - (notMarkedCount / totalActive) * 100}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      cx="18"
                      cy="18"
                      r="15.915"
                    />

                    {/* Present Segment (Green) */}
                    {presentCount > 0 && (
                      <circle
                        className="text-emerald-500 transition-all duration-500"
                        strokeWidth="3.8"
                        strokeDasharray={`${(presentCount / totalActive) * 100} ${100 - (presentCount / totalActive) * 100}`}
                        strokeDashoffset={`${25 - (notMarkedCount / totalActive) * 100}`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        cx="18"
                        cy="18"
                        r="15.915"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800">{totalActive}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Staff</span>
                  </div>
                </div>

                {/* Legends */}
                <div className="grid gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <span className="size-2.5 rounded-full bg-emerald-500" /> Present
                    </span>
                    <span className="font-extrabold text-slate-800">{presentCount} ({Math.round((presentCount / totalActive) * 100) || 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <span className="size-2.5 rounded-full bg-rose-500" /> Absent
                    </span>
                    <span className="font-extrabold text-slate-800">0 (0%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                      <span className="size-2.5 rounded-full bg-amber-500" /> Not Marked
                    </span>
                    <span className="font-extrabold text-slate-800">{notMarkedCount} ({Math.round((notMarkedCount / totalActive) * 100) || 0}%)</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between font-bold text-slate-800">
                    <span>Total Employees</span>
                    <span>{totalActive}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Clocking Module */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clocking State ({currentUserFullName})</p>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {isClockedIn ? `Clocked-in today at ${clockInTime}` : "You have not checked-in today."}
                </p>
              </div>
              <button
                onClick={handleClockToggle}
                className={`rounded px-5 py-2.5 text-xs font-black transition-all shadow-sm ${
                  isClockedIn
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                {isClockedIn ? "Clock Out Now" : "Clock In Now"}
              </button>
            </div>
          </Card>

          {/* Pending items Summary */}
          <div className="grid gap-4 flex-col justify-between">
            {/* Pending Leaves */}
            <Card className="border-slate-200 shadow-sm flex flex-col justify-between bg-white p-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Leave Approvals</h4>
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                    {pendingLeaves.length} Pending
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingLeaves.slice(0, 2).map((l, index) => (
                    <div key={index} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{l.name}</p>
                        <p className="text-[10px] text-slate-500 italic mt-0.5">"{l.reason}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-slate-700">{l.date}</span>
                        <p className="text-[10px] text-slate-400">{l.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => router.push("/dashboard/leaves")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Manage Leaves →
                </button>
              </div>
            </Card>

            {/* Pending Expenses */}
            <Card className="border-slate-200 shadow-sm flex flex-col justify-between bg-white p-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Expense Claims</h4>
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                    {pendingExpenses.length} Pending
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingExpenses.slice(0, 2).map((e, index) => (
                    <div key={index} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{e.name}</p>
                        <p className="text-[10px] text-slate-500 italic mt-0.5">"{e.notes}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900">INR {e.amount}</span>
                        <p className="text-[10px] text-slate-400">{e.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => router.push("/dashboard/finance?tab=expenses")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Manage Expenses →
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Row 2: Today's Attendance Checklist & Department Breakdown */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          
          {/* Today's Attendance Checklist */}
          <Card className="border-slate-200 shadow-sm flex flex-col justify-between bg-white p-5">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Today's Attendance Checklist</h3>
                <span className="text-[11px] font-semibold text-slate-500">Total roster size: {totalActive}</span>
              </div>

              <div className="overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
                <div className="divide-y divide-slate-100">
                  {staffMembers.map((member) => (
                    <div key={member.name} className="flex items-center justify-between py-2.5 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-full bg-blue-50 font-bold text-blue-600 shrink-0">
                          {member.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          member.status === "present"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          <span className={`size-1.5 rounded-full ${member.status === "present" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {member.status === "present" ? "Present" : "Not Marked"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Department Breakdown */}
          <Card className="border-slate-200 shadow-sm bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Department Headcount</h3>
            </div>
            <div className="overflow-y-auto max-h-[300px] pr-2">
              <div className="space-y-3">
                {departmentCounts.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                      <span>{dept.name}</span>
                      <span>{dept.count} {dept.count === 1 ? "staff" : "staffs"}</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded transition-all duration-300"
                        style={{ width: `${(dept.count / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Employee Status Summary & Promotions Timeline */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          
          {/* Employee Status Summary Grid */}
          <Card className="border-slate-200 shadow-sm bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Employee Appraisal Stats</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Complaints", value: 0, color: "text-slate-500 bg-slate-50" },
                { label: "Warnings", value: 0, color: "text-slate-500 bg-slate-50" },
                { label: "Expenses Approved", value: 40, color: "text-blue-600 bg-blue-50" },
                { label: "Appreciations", value: 17, color: "text-emerald-600 bg-emerald-50/50" },
                { label: "Assets Allocated", value: 20, color: "text-indigo-600 bg-indigo-50" },
                { label: "Feedback Received", value: 52, color: "text-purple-600 bg-purple-50" }
              ].map((stat) => (
                <div key={stat.label} className={`rounded-md p-4 text-center border border-slate-150 ${stat.color.split(' ')[1]}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-black mt-1 ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Increment & Promotions Timeline */}
          <Card className="border-slate-200 shadow-sm bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Promotions & Increments</h3>
            </div>
            
            <div className="relative pl-6 border-l-2 border-blue-100 space-y-6 ml-2 py-1">
              {promotions.map((p, idx) => (
                <div key={idx} className="relative">
                  {/* Point */}
                  <span className={`absolute -left-[31px] top-0.5 rounded-full size-4 border-2 bg-white flex items-center justify-center ${
                    p.type === "promotion" ? "border-emerald-500 text-emerald-500" : "border-blue-500 text-blue-500"
                  }`}>
                    <span className={`size-1.5 rounded-full ${p.type === "promotion" ? "bg-emerald-500" : "bg-blue-500"}`} />
                  </span>
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.type === "promotion" ? "bg-emerald-50 text-emerald-700" : "bg-blue-550 text-blue-750 bg-blue-50"
                      }`}>
                        {p.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold ml-auto">{p.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">{p.text}</p>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">"{p.desc}"</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 4: Upcoming Birthdays & Upcoming Anniversaries */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          
          {/* Birthdays */}
          <Card className="border-slate-200 shadow-sm bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3 flex items-center gap-2 text-rose-500">
              <Gift className="size-5" />
              <h3 className="text-base font-bold text-slate-900">Upcoming Birthdays</h3>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
              {birthdays.map((b) => (
                <div key={b.name} className="flex justify-between items-center py-2.5 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{b.name}</p>
                    <p className="text-[10px] text-slate-400">{b.designation}</p>
                  </div>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100">
                    {b.date}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Anniversaries */}
          <Card className="border-slate-200 shadow-sm bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3 flex items-center gap-2 text-emerald-600">
              <Award className="size-5" />
              <h3 className="text-base font-bold text-slate-900">Upcoming Anniversaries</h3>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
              {anniversaries.map((a) => (
                <div key={a.name} className="flex justify-between items-center py-2.5 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{a.name}</p>
                    <p className="text-[10px] text-slate-400">{a.designation} • {a.count} Year</p>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                    {a.date}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 5: Holiday Calendar */}
        <div className="mt-6">
          {renderHolidayCalendar()}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <SaasSidebar active="Dashboard" />

      <section className="p-6 lg:p-8 overflow-y-auto">
        {viewMode === "self" ? renderSelfDashboard() : renderManagerDashboard()}
      </section>
    </main>
  );
}
