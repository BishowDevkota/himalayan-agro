import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import { hasPermission } from "../../lib/permissions";

export default async function EmployeeDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/employee");

  const user = session.user;
  if (user?.role === "admin") return redirect("/admin/dashboard");
  if (user?.role !== "employee") return redirect("/");

  const canPayments = hasPermission(user, "payments:read");
  const canProducts = hasPermission(user, "products:read");
  const canVendors = hasPermission(user, "distributors:read");
  const canCategories = hasPermission(user, "categories:read");
  const canNews = hasPermission(user, "news:read");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Employee dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              Signed in as {user?.email} {user?.employeeRole ? `(${user.employeeRole})` : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canPayments && (
            <a className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" href="/admin/payment-requests">
              <h2 className="text-lg font-semibold">Payment requests</h2>
              <p className="mt-2 text-sm text-slate-600">Review and approve distributor payout requests.</p>
            </a>
          )}

          {canProducts && (
            <a className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" href="/admin/products">
              <h2 className="text-lg font-semibold">Products</h2>
              <p className="mt-2 text-sm text-slate-600">Manage product catalog and inventory.</p>
            </a>
          )}

          {canVendors && (
            <a className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" href="/admin/distributor">
              <h2 className="text-lg font-semibold">Distributor approvals</h2>
              <p className="mt-2 text-sm text-slate-600">Approve or reject distributor applications.</p>
            </a>
          )}

          {canCategories && (
            <a className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" href="/admin/categories">
              <h2 className="text-lg font-semibold">Categories</h2>
              <p className="mt-2 text-sm text-slate-600">Organize and manage product categories.</p>
            </a>
          )}

          {canNews && (
            <a className="rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" href="/admin/news">
              <h2 className="text-lg font-semibold">News</h2>
              <p className="mt-2 text-sm text-slate-600">Create and manage news articles.</p>
            </a>
          )}
        </div>

        {!canPayments && !canProducts && !canVendors && !canCategories && !canNews && (
          <div className="mt-10 rounded-2xl border border-gray-100 p-6 text-sm text-slate-600">
            Your account does not have any assigned permissions yet. Ask an admin to assign a role.
          </div>
        )}
      </div>
    </main>
  );
}
