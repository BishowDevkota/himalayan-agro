import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import AdminVendorsClient from "../../components/admin/AdminVendorsClient";
import connectToDatabase from "../../../lib/mongodb";
import Vendor from "../../../models/Vendor";
import User from "../../../models/User";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminVendorsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "vendors:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const vendors = await Vendor.find({}).sort({ createdAt: -1 }).lean();
  const userIds = vendors.map((v: any) => v.user);
  const users = await User.find({ _id: { $in: userIds } }).select("email isActive role").lean();
  const userById = new Map(users.map((u: any) => [String(u._id), u]));

  const safe = vendors.map((v: any) => {
    const u = userById.get(String(v.user));
    return {
      _id: String(v._id),
      userId: String(v.user),
      ownerName: v.ownerName || null,
      storeName: v.storeName,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone || null,
      address: v.address || null,
      description: v.description || null,
      status: v.status,
      rejectionReason: v.rejectionReason || null,
      createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : null,
      approvedAt: v.approvedAt ? new Date(v.approvedAt).toISOString() : null,
      userEmail: u?.email || null,
      userRole: u?.role || null,
      userActive: !!u?.isActive,
    };
  });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Vendor requests</h1>
            <p className="mt-2 text-sm text-slate-500">Review vendor applications and approve or reject them.</p>
          </div>
        </div>

        <AdminVendorsClient initialVendors={safe} />
      </div>
    </main>
  );
}
