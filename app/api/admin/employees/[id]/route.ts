import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import Employee from "../../../../../models/Employee";
import mongoose from "mongoose";
import { EMPLOYEE_ROLES, resolvePermissionsForEmployee } from "../../../../../lib/permissions";

async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return null;
  return session;
}

export async function PATCH(req: Request, context: any) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const updates: any = {};

  if (typeof body.role === "string") {
    const nextRole = body.role.trim();
    if (!EMPLOYEE_ROLES.includes(nextRole)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }
    updates.role = nextRole;
  }

  if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
  if (typeof body.password === "string") {
    if (body.password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }
    updates.password = body.password;
  }

  await connectToDatabase();
  const target = await Employee.findById(id);
  if (!target) return NextResponse.json({ message: "Employee not found" }, { status: 404 });

  const nextRole = updates.role || target.role;
  if (Array.isArray(body.permissions)) {
    updates.permissions = resolvePermissionsForEmployee(nextRole, body.permissions);
  } else if (updates.role) {
    updates.permissions = resolvePermissionsForEmployee(nextRole);
  }

  Object.assign(target, updates);
  await target.save();

  const safe = {
    _id: String(target._id),
    name: target.name || null,
    email: target.email,
    role: target.role,
    permissions: target.permissions || [],
    isActive: !!target.isActive,
  };

  return NextResponse.json({ employee: safe, message: "Updated" });
}

export async function DELETE(req: Request, context: any) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  await connectToDatabase();
  const target = await Employee.findById(id);
  if (!target) return NextResponse.json({ message: "Employee not found" }, { status: 404 });

  await target.deleteOne();
  return NextResponse.json({ message: "Deleted" });
}
