"use server";
import React from "react";
import connectToDatabase from "../../lib/mongodb";
import News from "../../models/News";

export default async function NoticesPage() {
  await connectToDatabase();
  // Fetch published news items categorized as notices, newest first
  const notices = await News.find({ status: "published", $or: [{ category: "notice" }, { category: "notices" }] }).sort({ publishedAt: -1, createdAt: -1 }).limit(50).lean();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        Notices
      </h1>
      <p className="text-gray-600 mb-6">Official notices published by the organisation. Use the admin CMS to manage notices.</p>

      {notices.length === 0 ? (
        <div className="text-gray-500">No notices available.</div>
      ) : (
        <div className="space-y-4">
          {notices.map((n: any) => (
            <article key={n._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">{n.title}</h3>
              {n.excerpt && <div className="text-sm text-gray-600 mt-1">{n.excerpt}</div>}
              <div className="text-xs text-gray-400 mt-2">{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : new Date(n.createdAt).toLocaleDateString()}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
