"use client";

import { useState } from "react";
import { toast } from "react-toastify";

function validateEmail(email: string) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) return toast.error("Please enter a valid email address");
    if (!message || message.trim().length < 10) return toast.error("Please enter a longer message (10+ chars)");

    setLoading(true);
    try {
      const res = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase().trim(), subject, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Unable to send message");

      toast.success("Thanks — your message was sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg w-full bg-white border rounded-md p-6 shadow-sm">
      <div className="mb-4">
        <label className="block text-sm font-medium">Full name</label>
        <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Subject</label>
        <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Message</label>
        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm min-h-[140px]" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>

      <div>
        <button className="w-full rounded-md bg-sky-600 text-white py-2 disabled:opacity-60" disabled={loading}>
          {loading ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
