"use server";
import React from "react";
import connectToDatabase from "../../lib/mongodb";
import Outlet from "../../models/Outlet";

export default async function OutletListPage({ searchParams }: { searchParams?: { q?: string } }) {
  await connectToDatabase();
  const q = (searchParams && searchParams.q) ? String(searchParams.q).trim() : "";
  const filter: any = { isActive: true };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { address: { $regex: q, $options: "i" } },
    ];
  }
  const outlets = await Outlet.find(filter).sort({ name: 1 }).limit(200).lean();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        Outlets
      </h1>
      <p className="text-gray-600 mb-6">Search and browse active outlets. Use the search query `?q=` to filter results.</p>

      {outlets.length === 0 ? (
        <div className="text-gray-500">No outlets found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outlets.map((o: any) => (
            <article key={o._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">{o.name}</h3>
              {o.address && <div className="text-sm text-gray-500 mt-1">{o.address}</div>}
              {o.contactPhone && <div className="text-sm text-gray-500 mt-2">Phone: {o.contactPhone}</div>}
              {o.contactEmail && <div className="text-sm text-gray-500">Email: {o.contactEmail}</div>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
