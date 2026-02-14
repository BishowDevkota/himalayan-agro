import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import VendorSignupClient from "../../components/VendorSignupClient";

export default async function VendorRegisterPage({ searchParams }: { searchParams?: { from?: string } | Promise<{ from?: string }> }) {
  const sp = (searchParams && typeof (searchParams as any)?.then === "function") ? await searchParams : (searchParams || {});
  const from = (sp as any).from || "/";

  const session = await getServerSession(authOptions as any);
  if (session) return redirect(from);

  return <VendorSignupClient from={from} />;
}
