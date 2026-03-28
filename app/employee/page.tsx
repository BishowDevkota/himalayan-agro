import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import { adminLandingForPermissions } from "../../lib/permissions";

export default async function EmployeeDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/employee");

  const user = session.user;
  if (user?.role === "admin") return redirect("/admin/dashboard");
  if (user?.role !== "employee") return redirect("/");

  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const target = adminLandingForPermissions(permissions);

  if (target === "/admin/dashboard") {
    return redirect("/");
  }

  return redirect(target);
}
