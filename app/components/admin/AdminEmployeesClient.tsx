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
    <div className="text-slate-900 space-y-5">
      {/* Search & Create Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{employees.length}</span> employees
          </div>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showCreate ? 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? "Cancel" : "+ Create employee"}
          </button>
        </div>

        {/* Inline Create Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Name</label>
              <input className="w-36 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="optional" value={createName} onChange={(e) => setCreateName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Email</label>
              <input className="w-48 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Password</label>
              <input className="w-36 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="min 8 chars" type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Role</label>
              <select className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" value={createRole} onChange={(e) => setCreateRole(e.target.value)}>
                {EMPLOYEE_ROLES.map((role) => (
                  <option key={role} value={role}>{roleLabel(role)}</option>
                ))}
              </select>
            </div>
            <button className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50" type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </button>
          </form>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Employee</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Role</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Joined</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
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
              <tr key={emp._id} className="align-top hover:bg-cyan-50/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
                      {(emp.name || emp.email || "E")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate text-sm">{emp.name || "—"}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{emp.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <select
                    className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                    value={emp.role}
                    onChange={(event) => handleRoleChange(emp, event.target.value)}
                  >
                    {EMPLOYEE_ROLES.map((role) => (
                      <option key={role} value={role}>{roleLabel(role)}</option>
                    ))}
                  </select>
                </td>

                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${emp.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${emp.isActive ? "bg-rose-50 hover:bg-rose-100 text-rose-700" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"}`}
                      onClick={() => handleToggleActive(emp)}
                    >
                      {emp.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 text-xs font-semibold transition-colors"
                      onClick={() => handleSetPassword(emp)}
                    >
                      Password
                    </button>
                    <button
                      className="rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold transition-colors"
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
    </div>
  );
}
