import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import mongoose from "mongoose";

async function requireAdmin(): Promise<any> {
  // `getServerSession` can be loosely typed in this workspace — cast to `any` for runtime checks.
  const session = await getServerSession(authOptions as any) as any;
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function PATCH(req: Request, context: any) {
  // Next.js' types sometimes represent `context.params` as a Promise — handle both safely.
  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const updates: any = {};
  if (typeof body.role === 'string') updates.role = body.role === 'admin' ? 'admin' : body.role === 'vendor' ? 'vendor' : 'user';
  if (typeof body.isActive === 'boolean') updates.isActive = body.isActive;
  if (typeof body.password === 'string' && body.password.length >= 8) {
    updates.password = body.password;
    updates.rawPassword = body.password;
  }

  await connectToDatabase();
  const target = await User.findById(id);
  if (!target) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  // Guard: prevent removing the last admin
  if (updates.role && updates.role !== 'admin') {
    const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: target._id } });
    if (target.role === 'admin' && otherAdmins < 1) {
      return NextResponse.json({ message: 'Cannot remove the last admin' }, { status: 400 });
    }
  }

  // Apply updates
  Object.assign(target, updates);
  await target.save();

  const safe = { _id: target._id, name: target.name, email: target.email, role: target.role, isActive: target.isActive, rawPassword: (target as any).rawPassword || null };
  return NextResponse.json({ user: safe, message: 'Updated' });
}

export async function DELETE(req: Request, context: any) {
  const params = await Promise.resolve(context?.params) as { id?: string } | undefined;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

  await connectToDatabase();
  const target = await User.findById(id);
  if (!target) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  // Prevent deleting the last admin
  if (target.role === 'admin') {
    const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: target._id } });
    if (otherAdmins < 1) return NextResponse.json({ message: 'Cannot delete the last admin' }, { status: 400 });
  }

  await target.deleteOne();
  return NextResponse.json({ message: 'Deleted' });
}
