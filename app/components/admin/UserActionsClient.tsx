"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserActionsClient({ userId, initialRole, initialActive }: { userId: string; initialRole: string; initialActive: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState(initialRole);
  const [isActive, setIsActive] = useState(!!initialActive);
  const [loading, setLoading] = useState(false);

  async function patch(payload: any) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      toast.success(json?.message || "Updated");
      return json.user;
    } catch (err: any) {
      toast.error(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote() {
    if (!confirm("Promote this user to admin?")) return;
    const u = await patch({ role: "admin" });
    setRole(u.role);
    router.refresh();
  }

  async function handleDemote() {
    if (!confirm("Demote this admin to user?")) return;
    const u = await patch({ role: "user" });
    setRole(u.role);
    router.refresh();
  }

  async function handleToggleActive() {
    const next = !isActive;
    if (!confirm(`${next ? 'Activate' : 'Deactivate'} this user?`)) return;
    const u = await patch({ isActive: next });
    setIsActive(u.isActive);
    router.refresh();
  }

  async function handleSetPassword() {
    const pw = prompt("Enter new password for the user (min 8 chars):");
    if (!pw) return;
    if (pw.length < 8) return alert("Password must be at least 8 characters");
    await patch({ password: pw });
    toast.success("Password updated (dev) — user can sign in with the new password");
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this user? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      toast.success("User deleted");
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex gap-3 items-center">
      {role === "admin" ? (
        <button className="rounded bg-amber-50 text-amber-800 px-3 py-1 text-sm" onClick={handleDemote} disabled={loading}>Demote</button>
      ) : (
        <button className="rounded bg-sky-600 text-white px-3 py-1 text-sm" onClick={handlePromote} disabled={loading}>Promote</button>
      )}

      <button className={`rounded ${isActive ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'} px-3 py-1 text-sm`} onClick={handleToggleActive} disabled={loading}>
        {isActive ? 'Deactivate' : 'Activate'}
      </button>

      <button className="rounded bg-gray-100 text-slate-800 px-3 py-1 text-sm" onClick={handleSetPassword} disabled={loading}>Set password</button>

      <button className="rounded bg-red-600 text-white px-3 py-1 text-sm" onClick={handleDelete} disabled={loading}>Delete user</button>
    </div>
  );
}
