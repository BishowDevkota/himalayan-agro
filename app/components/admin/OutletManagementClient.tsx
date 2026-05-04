"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ImageUpload from "./ImageUpload";

interface Outlet {
  _id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  profileImage?: string;
  galleryImages?: string[];
  primaryAdmin?: string;
  isActive: boolean;
  createdAt: string;
}

interface OutletManagementClientProps {
  initialOutlets: Outlet[];
}

export default function OutletManagementClient({ initialOutlets }: OutletManagementClientProps) {
  const router = useRouter();
  const [outlets, setOutlets] = useState<Outlet[]>(initialOutlets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    contactPhone: "",
    contactEmail: "",
    adminName: "",
    adminEmail: "",
    adminUsername: "",
    adminPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/outlets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profileImage: profileImage[0] || "",
          galleryImages,
          admin: {
            name: formData.adminName,
            email: formData.adminEmail,
            username: formData.adminUsername,
            password: formData.adminPassword,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create outlet");
      }

      const json = await res.json();
      const newOutlet = json.outlet || json;
      setOutlets((prev) => [newOutlet, ...prev]);
      setFormData({
        name: "",
        slug: "",
        description: "",
        address: "",
        contactPhone: "",
        contactEmail: "",
        adminName: "",
        adminEmail: "",
        adminUsername: "",
        adminPassword: "",
      });
      setProfileImage([]);
      setGalleryImages([]);
      setIsModalOpen(false);
      toast.success("Outlet created");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">Create New Outlet</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Outlet Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="e.g., Downtown Branch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the outlet"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="Physical address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="+1-800-123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="contact@outlet.com"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Outlet Admin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      placeholder="Outlet admin name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      placeholder="admin@outlet.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                    <input
                      type="text"
                      value={formData.adminUsername}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminUsername: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      placeholder="outlet-admin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, adminPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
                  <ImageUpload
                    images={profileImage}
                    onChange={(next) => setProfileImage(next.slice(0, 1))}
                    multiple={false}
                    uploadEndpoint="/api/admin/upload"
                    label="Upload profile image"
                    helpText="Upload one image for the outlet profile picture."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gallery</label>
                  <ImageUpload
                    images={galleryImages}
                    onChange={setGalleryImages}
                    uploadEndpoint="/api/admin/upload"
                    label="Upload gallery images"
                    helpText="Upload multiple images for the outlet gallery."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outlets List */}
      <div className="space-y-4">
        {outlets.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No outlets found. Create one to get started.</p>
          </div>
        ) : (
          outlets.map((outlet) => (
            <div key={outlet._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{outlet.name}</h3>
                    {outlet.isActive ? (
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  {outlet.description && <p className="text-sm text-slate-600 mt-1">{outlet.description}</p>}
                  {outlet.address && <p className="text-xs text-slate-500 mt-2">{outlet.address}</p>}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/admin/outlets/${outlet._id}/admins`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                  >
                    Manage Admins
                  </a>
                  <a
                    href={`/admin/${outlet.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-sm font-medium transition-colors"
                  >
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Outlet Button (floating) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </>
  );
}
