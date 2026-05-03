"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ImageUpload from "./ImageUpload";
import { EMPLOYEE_ROLES } from "../../../lib/permissions";

type Employee = {
  _id: string;
  name?: string | null;
  email: string;
  role: string;
  photo?: string | null;
  shortDescription?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  createdAt?: string | null;
};

function roleLabel(role: string) {
  return role.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export default function OutletEmployeesClient() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    shortDescription: "",
    role: EMPLOYEE_ROLES[0] || "accountant",
  });

  async function fetchEmployees() {
    setLoading(true);
    try {
      const res = await fetch("/api/outlet-admin/employees", { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch employees");
      setEmployees(json.employees || []);
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("Email and password are required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/outlet-admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photo: photo[0] || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to create employee");
      toast.success("Employee created");
      setEmployees((prev) => [json.employee, ...prev]);
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        shortDescription: "",
        role: EMPLOYEE_ROLES[0] || "accountant",
      });
      setPhoto([]);
      setShowCreate(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Outlet Employees</h2>
            <p className="mt-1 text-sm text-slate-500">Create accountant and shopkeeper accounts for this outlet.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((prev) => !prev)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showCreate ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
          >
            {showCreate ? "Close" : "+ Add employee"}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                >
                  {EMPLOYEE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {roleLabel(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                <input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
              <ImageUpload
                images={photo}
                onChange={setPhoto}
                multiple={false}
                uploadEndpoint="/api/outlet-admin/upload"
                label="Upload employee photo"
                helpText="Upload one image for the employee profile."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">No employees created yet.</div>
        ) : (
          employees.map((employee) => (
            <div key={employee._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-cyan-50 overflow-hidden flex items-center justify-center shrink-0">
                    {employee.photo ? <img src={employee.photo} alt={employee.name || employee.email} className="h-full w-full object-cover" /> : <span className="text-cyan-700 font-bold">{(employee.name || employee.email || "E")[0].toUpperCase()}</span>}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{employee.name || "Unnamed employee"}</h3>
                    <p className="text-sm text-slate-500">{employee.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{roleLabel(employee.role)}</span>
                      {employee.phoneNumber && <span>{employee.phoneNumber}</span>}
                    </div>
                    {employee.shortDescription && <p className="mt-3 text-sm text-slate-600">{employee.shortDescription}</p>}
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${employee.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}