"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EMPLOYEE_ROLES } from "../../../lib/permissions";

type Employee = {
  _id: string;
  name?: string | null;
  email: string;
  role: string;
  permissions?: string[];
  isActive: boolean;
  createdAt?: string | null;
};

function roleLabel(role: string) {
  return role.split("_").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export default function AdminEmployeesClient() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState(EMPLOYEE_ROLES[0] || "accountant");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/employees", { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch employees");
      setEmployees(json.employees || []);
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createEmail || !createPassword) return toast.error("Email and password required");
    if (createPassword.length < 8) return toast.error("Password must be at least 8 characters");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName || undefined,
          email: createEmail,
          password: createPassword,
          role: createRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      toast.success("Employee created");
      setCreateName("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole(EMPLOYEE_ROLES[0] || "accountant");
      setShowCreate(false);
      await fetchEmployees();
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setCreating(false);
    }
  }

  async function patchEmployee(id: string, payload: any) {
    const res = await fetch(`/api/admin/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
    return json.employee as Employee;
  }

  async function handleToggleActive(employee: Employee) {
    const next = !employee.isActive;
    if (!confirm(`${next ? "Activate" : "Deactivate"} this employee?`)) return;
    try {
      const updated = await patchEmployee(employee._id, { isActive: next });
      setEmployees((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
      toast.success("Employee updated");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    }
  }

  async function handleSetPassword(employee: Employee) {
    const pw = prompt("Enter new password (min 8 chars):");
    if (!pw) return;
    if (pw.length < 8) return alert("Password must be at least 8 characters");
    try {
      await patchEmployee(employee._id, { password: pw });
      toast.success("Password updated");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    }
  }

  async function handleRoleChange(employee: Employee, role: string) {
    if (role === employee.role) return;
    try {
      const updated = await patchEmployee(employee._id, { role });
      setEmployees((prev) => prev.map((e) => (e._id === updated._id ? { ...e, ...updated } : e)));
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    }
  }

  async function handleDelete(employee: Employee) {
    if (!confirm("Permanently delete this employee? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/employees/${employee._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      setEmployees((prev) => prev.filter((e) => e._id !== employee._id));
      toast.success("Employee deleted");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    }
  }

  return (
    <div className="text-slate-900">
      {/* Search & Create Bar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium text-slate-800">{employees.length}</span> employees
          </div>
          <button
            className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? "Cancel" : "Create employee"}
          </button>
        </div>

        {/* Inline Create Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Name</label>
              <input className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="optional" value={createName} onChange={(e) => setCreateName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input className="w-48 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Password</label>
              <input className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="min 8 chars" type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Role</label>
              <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900" value={createRole} onChange={(e) => setCreateRole(e.target.value)}>
                {EMPLOYEE_ROLES.map((role) => (
                  <option key={role} value={role}>{roleLabel(role)}</option>
                ))}
              </select>
            </div>
            <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </button>
          </form>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Employee</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Joined</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">Loading…</td></tr>
            )}
            {!loading && employees.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No employees yet.</td></tr>
            )}
            {!loading && employees.map((emp) => (
              <tr key={emp._id} className="align-top hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center text-slate-700 font-bold shrink-0">
                      {(emp.name || emp.email || "E")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{emp.name || "—"}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{emp.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <select
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-900"
                    value={emp.role}
                    onChange={(event) => handleRoleChange(emp, event.target.value)}
                  >
                    {EMPLOYEE_ROLES.map((role) => (
                      <option key={role} value={role}>{roleLabel(role)}</option>
                    ))}
                  </select>
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${emp.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className={`text-sm font-medium ${emp.isActive ? "text-rose-600 hover:text-rose-700" : "text-emerald-600 hover:text-emerald-700"}`}
                      onClick={() => handleToggleActive(emp)}
                    >
                      {emp.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="text-sm text-slate-500 hover:text-slate-700"
                      onClick={() => handleSetPassword(emp)}
                    >
                      Set password
                    </button>
                    <button
                      className="text-sm text-rose-600 hover:text-rose-700"
                      onClick={() => handleDelete(emp)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
