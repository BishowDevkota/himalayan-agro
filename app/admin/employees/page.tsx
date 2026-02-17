import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import Employee from "../../../models/Employee";
import AdminEmployeesClient from "../../components/admin/AdminEmployeesClient";

export default async function AdminEmployeesPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const employees = await Employee.find({}).sort({ createdAt: -1 }).lean();
  const safe = employees.map((e: any) => ({
    _id: String(e._id),
    name: e.name || null,
    email: e.email,
    role: e.role || "",
    isActive: !!e.isActive,
    createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
  }));

  const activeCount = safe.filter((e: any) => e.isActive).length;
  const inactiveCount = safe.filter((e: any) => !e.isActive).length;
  const roles = [...new Set(safe.map((e: any) => e.role).filter(Boolean))];

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Access</span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">Employees</h1>
            <p className="mt-1 text-sm text-slate-500">Create employees and assign role-based access.</p>
          </div>
          <a href="/admin/employees" className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm self-start">
            Refresh
          </a>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total Employees</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{safe.length}</div>
                <div className="mt-1 text-xs text-slate-400">All staff members</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center"><svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Active</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{activeCount}</div>
                <div className="mt-1 text-xs text-slate-400">Currently active</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Inactive</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{inactiveCount}</div>
                <div className="mt-1 text-xs text-slate-400">Deactivated staff</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center"><svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Roles</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{roles.length}</div>
                <div className="mt-1 text-xs text-slate-400">Unique roles assigned</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center"><svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg></div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <AdminEmployeesClient />
      </div>
    </main>
  );
}
