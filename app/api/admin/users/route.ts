import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

// Helper: require admin session
async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  await connectToDatabase();
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const perPage = Math.min(100, Math.max(10, parseInt(url.searchParams.get('perPage') || '20', 10)));

  const filter: any = {};
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ email: rx }, { name: rx }];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select('name email role isActive createdAt +rawPassword')
      .lean(),
  ]);

  return NextResponse.json({ total, page, perPage, users });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().toLowerCase().trim();
  const password = (body.password || '').toString();
  const role = body.role === 'admin' ? 'admin' : body.role === 'distributer' ? 'distributer' : 'user';

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
  }

  await connectToDatabase();
  const exists = await User.findOne({ email }).lean();
  if (exists) return NextResponse.json({ message: 'Email already in use' }, { status: 409 });

  const user = new User({ name: name || undefined, email, password, role });
  await user.save();
  const safe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
  return NextResponse.json({ user: safe, message: 'User created' }, { status: 201 });
}
