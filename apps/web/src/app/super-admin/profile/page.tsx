"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppNav } from "@/components/app/app-nav";
import { Card, Badge } from "@/components/ui";
import { KeyRound, UserCog, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function SuperAdminProfilePage() {
  const router = useRouter();

  // Profile details states
  const [fullName, setFullName] = useState("SaaS Super Admin");
  const [email, setEmail] = useState("superadmin@bharathrms.local");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [designation, setDesignation] = useState("Platform Owner");

  // Password fields states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Auth guard check
      const userType = localStorage.getItem("session_user_type");
      if (userType !== "super-admin") {
        router.push("/login?tab=super-admin");
        return;
      }

      // Load active profile from localStorage (either session or customized profile config)
      const storedProfileStr = localStorage.getItem("saas_profile");
      if (storedProfileStr) {
        const storedProfile = JSON.parse(storedProfileStr);
        setFullName(storedProfile.fullName || "SaaS Super Admin");
        setEmail(storedProfile.email || "superadmin@bharathrms.local");
        setMobile(storedProfile.mobile || "+91 98765 43210");
        setDesignation(storedProfile.designation || "Platform Owner");
      } else {
        // Fallback to active session email
        const activeEmail = localStorage.getItem("session_admin_email");
        const activeName = localStorage.getItem("session_admin_name");
        if (activeEmail) setEmail(activeEmail);
        if (activeName) setFullName(activeName);
      }
    }
  }, [router]);

  // Handle Profile Details Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!fullName || !email) {
      setProfileError("Full Name and Email are required fields.");
      return;
    }

    try {
      // Retrieve profile database or default
      const storedProfileStr = localStorage.getItem("saas_profile");
      const currentProfileObj = storedProfileStr ? JSON.parse(storedProfileStr) : { password: "SuperAdmin@123" };
      
      const updatedProfile = {
        ...currentProfileObj,
        fullName,
        email: email.toLowerCase(),
        mobile,
        designation
      };

      // Save to localStorage
      localStorage.setItem("saas_profile", JSON.stringify(updatedProfile));
      localStorage.setItem("session_admin_name", fullName);
      localStorage.setItem("session_admin_email", email.toLowerCase());

      // Update in saas_admins if we signed up with this email
      const adminsStr = localStorage.getItem("saas_admins");
      if (adminsStr) {
        const admins = JSON.parse(adminsStr);
        const adminIdx = admins.findIndex((a: any) => a.email.toLowerCase() === email.toLowerCase());
        if (adminIdx !== -1) {
          admins[adminIdx] = {
            ...admins[adminIdx],
            fullName,
            mobile,
            designation
          };
          localStorage.setItem("saas_admins", JSON.stringify(admins));
        }
      }

      setProfileSuccess("Admin profile details updated successfully.");
    } catch (e) {
      setProfileError("Failed to update profile settings.");
    }
  };

  // Handle Password Change Save
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please enter current password and fill new password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Confirm password does not match new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      // 1. Resolve what the actual password is currently
      let correctCurrentPass = "SuperAdmin@123"; // default root password

      // Check customized profile password
      const storedProfileStr = localStorage.getItem("saas_profile");
      if (storedProfileStr) {
        const storedProfile = JSON.parse(storedProfileStr);
        if (storedProfile.password) {
          correctCurrentPass = storedProfile.password;
        }
      }

      // Check saas_admins array
      const adminsStr = localStorage.getItem("saas_admins");
      let adminRecordIdx = -1;
      let adminsArr: any[] = [];
      
      if (adminsStr) {
        adminsArr = JSON.parse(adminsStr);
        const adminRecord = adminsArr.find((a: any, idx: number) => {
          if (a.email.toLowerCase() === email.toLowerCase()) {
            adminRecordIdx = idx;
            return true;
          }
          return false;
        });
        if (adminRecord) {
          correctCurrentPass = adminRecord.password;
        }
      }

      // 2. Validate current password matches
      if (currentPassword !== correctCurrentPass) {
        setPasswordError("The current password you entered is incorrect.");
        return;
      }

      // 3. Save new password
      const updatedProfileObj = storedProfileStr ? JSON.parse(storedProfileStr) : {
        fullName,
        email,
        mobile,
        designation
      };
      
      updatedProfileObj.password = newPassword;
      localStorage.setItem("saas_profile", JSON.stringify(updatedProfileObj));

      // Update in admins database
      if (adminRecordIdx !== -1) {
        adminsArr[adminRecordIdx].password = newPassword;
        localStorage.setItem("saas_admins", JSON.stringify(adminsArr));
      }

      setPasswordSuccess("Security password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPasswordError("An error occurred during password change.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <AppNav />
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-4">
          <Link href="/super-admin" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition">
            <ArrowLeft className="size-3" /> Back to Console Directory
          </Link>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">SaaS Administrator Settings</p>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Profile Management</h2>
            <p className="mt-1.5 text-sm text-slate-500">Update SaaS admin name, email, credentials, and default passwords.</p>
          </div>
          <Badge>Admin Security Session</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Admin Details Card */}
          <Card className="p-7 border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <UserCog className="text-indigo-600 size-5" />
                <h3 className="text-lg font-bold text-slate-900">Administrator Details</h3>
              </div>

              {profileError && (
                <div className="mb-4 flex items-center gap-2 rounded bg-rose-50 border border-rose-100 p-3 text-xs text-rose-800 font-semibold">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Full Name *
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Contact Email *
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Mobile Number
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Administrative Designation
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                  />
                </label>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 text-sm font-bold shadow-sm"
                  >
                    Save profile details
                  </button>
                </div>
              </form>
            </div>
          </Card>

          {/* Change Password Card */}
          <Card className="p-7 border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                <KeyRound className="text-indigo-600 size-5" />
                <h3 className="text-lg font-bold text-slate-900">Change Admin Password</h3>
              </div>

              {passwordError && (
                <div className="mb-4 flex items-center gap-2 rounded bg-rose-50 border border-rose-100 p-3 text-xs text-rose-800 font-semibold">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Current Password *
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  New Password *
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Confirm New Password *
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="h-10 rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-indigo-500"
                    required
                  />
                </label>

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="rounded bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 text-sm font-bold shadow-sm"
                  >
                    Change password
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
