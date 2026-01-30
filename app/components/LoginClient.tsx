"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to continue.",
  OAuthSignin: "Error signing in with provider.",
  OAuthCallback: "Authentication callback error.",
  OAuthCreateAccount: "Error creating account with provider.",
  EmailCreateAccount: "Error creating account with email.",
  Default: "Sign in failed. Please try again.",
};

export default function LoginClient({ from, serverError }: { from: string; serverError?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (serverError) {
      const msg = ERROR_MESSAGES[serverError] || serverError || ERROR_MESSAGES.Default;
      setError(msg);
      toast.error(msg);
    }
  }, [serverError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { redirect: false, email: (email||"").toLowerCase().trim(), password });
    setLoading(false);
    // @ts-ignore
    if (res?.error) {
      const msg = ERROR_MESSAGES[res.error] || res.error || ERROR_MESSAGES.Default;
      setError(msg);
      toast.error(msg);
      return;
    }
    router.push(from || "/");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / hero (desktop only) */}
        <div className="hidden md:flex flex-col justify-center gap-6 p-8 bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-md">
          <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center font-black">H</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-600 max-w-sm">Sign in to manage your orders, track shipments and check out faster. Secure, fast and farmer‑friendly.</p>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Saved carts & quick reorder</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Order tracking & receipts</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Secure checkout</span></li>
          </ul>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-slate-900">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div>
                <h1 className="text-2xl font-extrabold">Sign in to your account</h1>
                <p className="mt-1 text-sm text-gray-500">Use your email to continue — secure and fast.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6" aria-describedby={error ? 'login-error' : undefined}>
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="login-email"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <div className="">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                </div>

                <input
                  id="login-password"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div id="login-error" role="alert" className="text-sm text-rose-600">{error}</div>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  Remember me
                </label>

                <button
                  className="ml-auto inline-flex items-center gap-3 rounded-lg bg-sky-600 px-5 py-3 text-white font-semibold shadow-md hover:brightness-105 disabled:opacity-60"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${loading ? 'animate-spin' : ''} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M12 4v4m0 8v4m8-8h-4M4 12H0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{loading ? 'Signing in…' : 'Sign in'}</span>
                </button>
              </div>

              <div className="pt-2">
                <div className="text-center text-sm text-gray-500">Don’t have an account? <a href="/register" className="text-sky-600 hover:underline">Create one</a></div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-400">Secure checkout</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}