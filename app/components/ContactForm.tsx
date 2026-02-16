"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      toast.success("Message sent successfully!");
    }, 1000);
  }

  const fieldWrap = (field: string) =>
    `relative rounded-xl border-2 transition-all duration-300 ${
      focusedField === field
        ? "border-[#2da8da] shadow-[0_0_0_3px_rgba(45,168,218,0.08)]"
        : "border-gray-100 hover:border-gray-200"
    }`;

  return (
    <div className="w-full relative">
      <div className="w-full grid grid-cols-1 md:grid-cols-[2fr_3fr] items-stretch">
        <div className="hidden md:flex flex-col justify-between p-10 lg:p-12 rounded-l-3xl relative overflow-hidden bg-[#0f2a4a] text-white">
          <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">Himalaya Agro</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">Let&apos;s talk</h2>
            <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-xs">
              Share your needs and our team will reach out within 24 hours.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-4">
            {[
              { title: "Fast response", desc: "Dedicated support team" },
              { title: "Clear timelines", desc: "We set expectations early" },
              { title: "Trusted by growers", desc: "Reliable, on-time delivery" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-10 text-xs text-white/60">
            <div>Support: contact@himalaya.example</div>
            <div className="mt-2">Open: Mon - Fri</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl md:rounded-l-none md:rounded-r-3xl shadow-2xl shadow-gray-200/60 p-8 sm:p-10 lg:p-12 text-slate-900 relative">
          <div className="max-w-xl mx-auto">
            <div className="md:hidden mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Himalaya</p>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 tracking-tight">Send us a message</h1>
              <p className="mt-2 text-sm text-gray-400">We will get back to you shortly.</p>
            </div>

            <form
              onSubmit={onSubmit}
              className={`${showSuccess ? "opacity-0 pointer-events-none" : "opacity-100"} transition-all duration-300 space-y-5`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full name</label>
                  <div className={fieldWrap("name")}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4.5 h-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z" />
                      </svg>
                    </div>
                    <input
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none rounded-xl"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email address</label>
                  <div className={fieldWrap("email")}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4.5 h-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      type="email"
                      placeholder="you@company.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                  <div className={fieldWrap("subject")}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4.5 h-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h9m-9 4.5h9m-9 4.5h5.25M4.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5z" />
                      </svg>
                    </div>
                    <input
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none rounded-xl"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="General inquiry"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                  <div className={fieldWrap("phone")}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4.5 h-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38A12.035 12.035 0 017.68 13.27a1.125 1.125 0 01.38-1.21l1.293-.97c.363-.272.527-.734.417-1.173L8.664 5.494a1.125 1.125 0 00-1.09-.852H6.75A2.25 2.25 0 004.5 6.75v0z" />
                      </svg>
                    </div>
                    <input
                      className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none rounded-xl"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      type="tel"
                      placeholder="+1 (000) 000-0000"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your message</label>
                <div className={fieldWrap("message")}>
                  <div className="absolute left-4 top-4 text-black pointer-events-none">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5M6.75 12h7.5m-7.5 4.5h4.5m-6-12.75h12a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25h-12A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25z" />
                    </svg>
                  </div>
                  <textarea
                    className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none rounded-xl resize-none min-h-[140px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    placeholder="How can we help you today?"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-white text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-[#2da8da] hover:bg-[#1e8bb8]"
                style={loading ? { backgroundColor: "#9ca3af" } : undefined}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <div
            className={`${showSuccess ? "flex" : "hidden"} absolute inset-0 bg-white flex-col items-center justify-center text-center p-12 animate-[fadeIn_0.4s_ease-out]`}
          >
            <div className="mb-6 w-16 h-16 bg-green-50 text-[#2da8da] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Message sent</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Expect a response within 24 hours.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-8 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Back to form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}