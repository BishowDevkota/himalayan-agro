"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface OutletAdmin {
  _id: string;
  username: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface OutletAdminManagementClientProps {
  outletId: string;
  initialAdmins: OutletAdmin[];
  outletName: string;
}

export default function OutletAdminManagementClient({ outletId, initialAdmins, outletName }: OutletAdminManagementClientProps) {
  const router = useRouter();
  const [admins, setAdmins] = useState<OutletAdmin[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/outlets/${outletId}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create admin");
      }

      const newAdmin = await res.json();
      setAdmins((prev) => [newAdmin, ...prev]);
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
      });
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">Create Outlet Admin</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="admin@outlet.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  placeholder="username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
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

      {/* Admins List */}
      <div className="space-y-4">
        {admins.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No admins found. Create one to get started.</p>
          </div>
        ) : (
          admins.map((admin) => (
            <div key={admin._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{admin.name || admin.username}</h3>
                      <p className="text-sm text-slate-600">{admin.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {admin.isActive ? (
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Admin Button (floating) */}
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
