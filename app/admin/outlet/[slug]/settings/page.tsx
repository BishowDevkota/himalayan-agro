import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "../../../../../lib/mongodb";
import Outlet from "../../../../../models/Outlet";
import { serialize } from "../../../../../lib/serialize";
import OutletSettingsClient from "../../../../components/admin/OutletSettingsClient";
import OutletEmployeesClient from "../../../../components/admin/OutletEmployeesClient";

export default async function OutletSettingsPage({ params }: { params: { slug: string } } | { params: Promise<{ slug: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "outlet-admin" || session.user?.outletSlug !== slug) {
    return redirect("/login");
  }

  await connectToDatabase();

  const outlet = await Outlet.findOne({ slug }).lean();
  if (!outlet) return notFound();

  const safeOutlet = serialize(outlet);

  return (
    <main className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <a href={`/admin/outlet-${slug}`} className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mb-4 inline-block">
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-slate-900">Outlet Management</h1>
          <p className="mt-2 text-sm text-slate-500">Edit outlet details, profile images, and outlet staff.</p>
        </div>

        <section id="outlet-info">
          <OutletSettingsClient initialOutlet={safeOutlet as any} />
        </section>
        <section id="employees">
          <OutletEmployeesClient />
        </section>
      </div>
    </main>
  );
}