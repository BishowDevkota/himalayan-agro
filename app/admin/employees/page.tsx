import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import AdminEmployeesClient from "../../components/admin/AdminEmployeesClient";

export default async function AdminEmployeesPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Access</span>
            <h1 className="mt-3 text-4xl font-black">Employees</h1>
            <p className="mt-3 text-sm text-slate-500">Create employees and assign role-based access.</p>
          </div>
        </div>

        <AdminEmployeesClient />
      </div>
    </main>
  );
}
