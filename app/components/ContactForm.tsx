"use client";
import { useId, useState } from "react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      toast.success("Message sent successfully!");
    }, 1000);
  }

  // Common Tailwind for inputs to keep code clean
  const inputClass = "w-full bg-transparent py-4 border-b-2 border-black focus:border-b-[3px] outline-none transition-all placeholder:text-gray-300 font-medium text-black";
  const labelClass = "text-sm uppercase tracking-[0.2em] font-black text-black mb-3 block";

  return (
    <div className="w-full relative min-h-[500px]">
      <form
        onSubmit={onSubmit}
        className={`${showSuccess ? "opacity-0 pointer-events-none" : "opacity-100"} transition-all duration-300 space-y-12`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className={labelClass}>Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="John Doe" />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Email Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="john@example.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className={labelClass}>Subject</label>
            <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} placeholder="General Inquiry" />
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 (000) 000-0000" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Your Message</label>
          <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} resize-none`} placeholder="How can we help you today?" />
        </div>

        {/* Button: Blue to Green (#64cc98) hover */}
        <button
          type="submit"
          disabled={loading}
          className="group w-full md:w-auto flex items-center justify-center gap-4 text-white px-14 py-5 rounded-full font-black uppercase tracking-widest text-xs active:scale-95 shadow-lg bg-[#29A8DD] hover:bg-[#64cc98] hover:-translate-y-0.5 transition-all duration-300 shadow-blue-100/50 hover:shadow-[#64cc98]/30"
        >
          {loading ? "Sending..." : "Send Message"}
          {!loading && <span className="group-hover:translate-x-2 transition-transform">→</span>}
        </button>
      </form>

      {/* Success State Overlay */}
      <div className={`${showSuccess ? "flex" : "hidden"} absolute inset-0 bg-white flex-col items-center justify-center text-center p-12 animate-[fadeIn_0.4s_ease-out]`}>
        <div className="mb-6 w-20 h-20 bg-green-50 text-[#64cc98] rounded-full flex items-center justify-center">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-3xl font-black text-black mb-4">Success!</h3>
        <p className="text-gray-500 max-w-sm mx-auto">Expect a response within 24 hours.</p>
        <button onClick={() => setShowSuccess(false)} className="mt-10 px-8 py-3 border-2 border-black text-black font-black rounded-full hover:bg-black hover:text-white transition-colors duration-300">
          Back to Form
        </button>
      </div>
    </div>
  );
}