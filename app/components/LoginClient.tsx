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
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div>
          <button
            className="w-full rounded-md bg-sky-600 text-white py-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}