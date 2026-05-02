import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import User from "../models/User";
import Employee from "../models/Employee";
import OutletAdmin from "../models/OutletAdmin";
import Outlet from "../models/Outlet";
import { resolvePermissionsForEmployee } from "./permissions";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@domain.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        let { email, password } = credentials;
        email = (email || "").toLowerCase().trim();

        // Admin via env (no DB record required)
        if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
          if (email === (process.env.ADMIN_EMAIL || "").toLowerCase() && password === process.env.ADMIN_PASSWORD) {
            return { id: "admin", name: "Administrator", email, role: "admin", permissions: ["*"] } as any;
          }
        }

        await connectToDatabase();
        const user = await User.findOne({ email }).exec();
        if (user && user.password) {
          if (user.isActive === false) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            if (process.env.NODE_ENV !== "production") console.debug("Credentials: password mismatch for", email);
            return null;
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.role === "admin" ? ["*"] : [],
          } as any;
        }

        const employee = await Employee.findOne({ email }).exec();
        if (employee && employee.password) {
          if (employee.isActive === false) return null;
          const isValid = await bcrypt.compare(password, employee.password);
          if (!isValid) {
            if (process.env.NODE_ENV !== "production") console.debug("Credentials: password mismatch for", email);
            return null;
          }
          return {
            id: employee._id.toString(),
            name: employee.name,
            email: employee.email,
            role: "employee",
            employeeRole: employee.role,
            permissions: resolvePermissionsForEmployee(employee.role, employee.permissions),
          } as any;
        }

        // Outlet Admin
        const outletAdmin = await OutletAdmin.findOne({ email }).exec();
        if (outletAdmin?.password) {
          if (outletAdmin.isActive === false) return null;
          const isValid = await bcrypt.compare(password, outletAdmin.password);
          if (!isValid) {
            if (process.env.NODE_ENV !== "production") console.debug("Credentials: password mismatch for outlet admin", email);
            return null;
          }
          const outlet = await Outlet.findById(outletAdmin.outlet).exec();
          if (!outlet || !outlet.isActive) return null;
          return {
            id: outletAdmin._id.toString(),
            name: outletAdmin.name || outletAdmin.username,
            email: outletAdmin.email,
            role: "outlet-admin",
            outletId: outlet._id.toString(),
            outletName: outlet.name,
            outletSlug: outlet.slug,
            permissions: ["outlet:*"],
          } as any;
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // first time jwt callback is run, user object is available
      if (user) {
        token.role = (user as any).role || "user";
        token.id = (user as any).id || (user as any)._id;
        token.permissions = (user as any).permissions || [];
        token.employeeRole = (user as any).employeeRole || undefined;
        token.outletId = (user as any).outletId || undefined;
        token.outletName = (user as any).outletName || undefined;
        token.outletSlug = (user as any).outletSlug || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).permissions = token.permissions || [];
        (session.user as any).employeeRole = token.employeeRole || undefined;
        (session.user as any).outletId = token.outletId || undefined;
        (session.user as any).outletName = token.outletName || undefined;
        (session.user as any).outletSlug = token.outletSlug || undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default authOptions;