import { getServerSession } from "next-auth/next";
import authOptions from "./auth";

export async function getSessionUser() {
  const session = (await getServerSession(authOptions as any)) as any;
  return session?.user ?? null;
}

export function requireUser(user: any) {
  if (!user) {
    const err: any = new Error("Authentication required");
    err.status = 401;
    throw err;
  }
  return user;
}

export function requireAdmin(user: any) {
  requireUser(user);
  if (user.role !== "admin") {
    const err: any = new Error("Admin role required");
    err.status = 403;
    throw err;
  }
  return user;
}

export function requireVendor(user: any) {
  requireUser(user);
  if (user.role !== "distributer") {
    const err: any = new Error("Distributer role required");
    err.status = 403;
    throw err;
  }
  return user;
}