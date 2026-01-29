import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import SignupClient from "../components/SignupClient";
import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }: { searchParams?: { from?: string } }) {
  const session = await getServerSession(authOptions as any);
  if (session) return redirect((searchParams as any)?.from || "/");
  const from = (searchParams as any)?.from || "/";
  return <SignupClient from={from} />;
}