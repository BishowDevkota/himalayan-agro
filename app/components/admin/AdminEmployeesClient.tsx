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
      await fetchEmployees();
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setCreating(false);
    }
  }

  async function patchEmployee(id: string, payload: any) {
    const res = await fetch(`/api/admin/employees/${id}` , {
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
    <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Employee management</h2>
          <p className="text-sm text-slate-500 mt-1">Create employees and assign role-based access.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3 mb-6">
        <input className="hidden" />
        <input
          className="w-40 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          placeholder="name (optional)"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
        />
        <input
          className="w-52 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          placeholder="email"
          value={createEmail}
          onChange={(e) => setCreateEmail(e.target.value)}
        />
        <input
          className="w-40 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          placeholder="password"
          type="password"
          value={createPassword}
          onChange={(e) => setCreatePassword(e.target.value)}
        />
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={createRole}
          onChange={(e) => setCreateRole(e.target.value)}
        >
          {EMPLOYEE_ROLES.map((role) => (
            <option key={role} value={role}>{roleLabel(role)}</option>
          ))}
        </select>
        <button
          className="rounded bg-sky-600 text-white px-4 py-2 text-sm"
          type="submit"
          disabled={creating}
        >
          {creating ? "Creating…" : "Create employee"}
        </button>
      </form>

      {loading ? (
        <div className="py-6 text-center text-sm text-slate-500">Loading…</div>
      ) : employees.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-500">No employees yet</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {employees.map((e) => (
            <div key={e._id} className="py-4 flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-slate-700 font-bold">
                  {(e.name || e.email || "E")[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{e.name || "—"}</div>
                  <div className="text-sm text-slate-500">{e.email}</div>
                  <div className="text-xs text-slate-400 mt-1">Role: {roleLabel(e.role)}</div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-xs ${e.isActive ? "text-emerald-600" : "text-red-600"}`}>
                  {e.isActive ? "Active" : "Inactive"}
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
                  <select
                    className="rounded border border-gray-200 px-2 py-1 text-xs"
                    value={e.role}
                    onChange={(event) => handleRoleChange(e, event.target.value)}
                  >
                    {EMPLOYEE_ROLES.map((role) => (
                      <option key={role} value={role}>{roleLabel(role)}</option>
                    ))}
                  </select>
                  <button
                    className={`rounded px-2 py-1 text-xs ${e.isActive ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                    onClick={() => handleToggleActive(e)}
                  >
                    {e.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="rounded bg-gray-100 text-slate-800 px-2 py-1 text-xs"
                    onClick={() => handleSetPassword(e)}
                  >
                    Set password
                  </button>
                  <button
                    className="rounded bg-red-600 text-white px-2 py-1 text-xs"
                    onClick={() => handleDelete(e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
