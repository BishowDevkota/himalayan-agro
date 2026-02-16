import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import Employee from "../../../../models/Employee";
import User from "../../../../models/User";
import { EMPLOYEE_ROLES, resolvePermissionsForEmployee } from "../../../../lib/permissions";

async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await connectToDatabase();
  const employees = await Employee.find({}).sort({ createdAt: -1 }).lean();

  const safe = (employees || []).map((e: any) => ({
    _id: String(e._id),
    name: e.name || null,
    email: e.email || null,
    role: e.role,
    permissions: Array.isArray(e.permissions) ? e.permissions : [],
    isActive: !!e.isActive,
    createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
  }));

  return NextResponse.json({ employees: safe });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const name = (body.name || "").toString().trim();
  const email = (body.email || "").toString().toLowerCase().trim();
  const password = (body.password || "").toString();
  const role = (body.role || "").toString().trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (!EMPLOYEE_ROLES.includes(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  await connectToDatabase();
  const [existingUser, existingEmployee] = await Promise.all([
    User.findOne({ email }).lean(),
    Employee.findOne({ email }).lean(),
  ]);
  if (existingUser || existingEmployee) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const employee = new Employee({
    name: name || undefined,
    email,
    password,
    role,
    permissions: resolvePermissionsForEmployee(role, Array.isArray(body.permissions) ? body.permissions : undefined),
  });

  await employee.save();

  const safe = {
    _id: String(employee._id),
    name: employee.name || null,
    email: employee.email,
    role: employee.role,
    permissions: employee.permissions || [],
    isActive: !!employee.isActive,
    createdAt: employee.createdAt ? new Date(employee.createdAt).toISOString() : null,
  };

  return NextResponse.json({ employee: safe, message: "Employee created" }, { status: 201 });
}
