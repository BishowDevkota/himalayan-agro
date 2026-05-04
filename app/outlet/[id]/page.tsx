import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Outlet from "../../../models/Outlet";
import Employee from "../../../models/Employee";
import OutletAdmin from "../../../models/OutletAdmin";
import { serialize, serializeMany } from "../../../lib/serialize";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

async function fetchData(id: string) {
  await connectToDatabase();
  const outlet = await Outlet.findById(id).lean();
  if (!outlet) return null;
  const employees = await Employee.find({ outlet: id }).lean();
  const admins = await OutletAdmin.find({ outlet: id }).select("username name").lean();
  return { outlet: serialize(outlet), employees: serializeMany(employees as any[]), admins: serializeMany(admins as any[]) };
}

function extractGoogleMapsSrc(address?: string) {
  if (!address) return null;
  const srcMatch = address.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*><\/iframe>/i);
  if (srcMatch?.[1]) return srcMatch[1];
  const openTagMatch = address.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (openTagMatch?.[1]) return openTagMatch[1];
  return null;
}

export default async function OutletPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolved = params instanceof Promise ? await params : params;
  const { id } = resolved;

  const data = await fetchData(id);
  if (!data) return <div className="p-12">Outlet not found</div>;

  const session = (await getServerSession(authOptions as any)) as any;
  const canEdit = session && session.user && (session.user.role === "admin" || (session.user.role === "outlet-admin" && session.user.outletId === id));

  const { outlet, employees, admins } = data;

  const mapSrc = extractGoogleMapsSrc(outlet.address) || `https://www.google.com/maps?q=${encodeURIComponent(outlet.address || outlet.name || "")}&output=embed`;
  const showAddressText = !extractGoogleMapsSrc(outlet.address) && !!outlet.address;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold">{outlet.name}</h1>
            {outlet.description && <p className="text-slate-600 mt-2">{outlet.description}</p>}
            <div className="mt-4 text-sm text-slate-500">
              {showAddressText && <div><strong>Address:</strong> {outlet.address}</div>}
              {outlet.contactPhone && <div><strong>Phone:</strong> {outlet.contactPhone}</div>}
              {outlet.contactEmail && <div><strong>Email:</strong> {outlet.contactEmail}</div>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Location</h2>
            {outlet.address ? (
              <div className="mt-4 w-full h-64 rounded overflow-hidden">
                <iframe src={mapSrc} width="100%" height="100%" loading="lazy" />
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No address provided for this outlet.</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Gallery</h2>
            {Array.isArray(outlet.galleryImages) && outlet.galleryImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {outlet.galleryImages.map((src: string, i: number) => (
                  <img key={i} src={src} className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No gallery images uploaded.</p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold">Our Team</h3>
            <p className="text-sm text-slate-500 mt-1">Outlet admins and staff</p>

            <div className="mt-4 space-y-3">
              {admins.map((a: any) => (
                <div key={a._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 grid place-items-center text-slate-700 font-semibold">A</div>
                  <div>
                    <div className="font-medium">{a.name || a.username}</div>
                    <div className="text-xs text-slate-500">Outlet Admin</div>
                  </div>
                </div>
              ))}

              {employees.map((e: any) => (
                <div key={e._id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden">
                    {e.photo ? <img src={e.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-slate-700">{(e.name||'E')[0].toUpperCase()}</div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{e.name || "Unnamed"}</div>
                    <div className="text-xs text-slate-500">{e.role}</div>
                    {e.shortDescription && <div className="text-sm text-slate-600 mt-1">{e.shortDescription}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canEdit && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <h4 className="font-semibold">Manage</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Link href={`/admin/outlet/${outlet.slug}/settings`} className="text-sm text-cyan-600">Edit outlet info & images</Link>
                <Link href={`/admin/outlet/${outlet.slug}`} className="text-sm text-cyan-600">Manage products & staff</Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
