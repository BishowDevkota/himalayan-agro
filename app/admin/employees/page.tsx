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
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Access</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Employees</h1>
            <p className="mt-3 text-sm text-slate-500">
              Create employees and assign role-based access.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/employees"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700"
            >
              Refresh
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Employees</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length}</div>
                <div className="mt-2 text-sm text-slate-400">All staff members</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">E</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Active</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{activeCount}</div>
                <div className="mt-2 text-sm text-slate-400">Currently active</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">✓</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Inactive</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{inactiveCount}</div>
                <div className="mt-2 text-sm text-slate-400">Deactivated staff</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-bold">✗</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Roles</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{roles.length}</div>
                <div className="mt-2 text-sm text-slate-400">Unique roles assigned</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">R</div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="mt-8">
          <AdminEmployeesClient />
        </div>
      </div>
    </main>
  );
}
