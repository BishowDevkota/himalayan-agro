import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  rawPassword?: string;
  role: "user" | "admin" | "vendor";
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    rawPassword: { type: String, select: false },
    role: { type: String, enum: ["user", "admin", "vendor"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const user = this as IUser;
  // Be defensive: `isModified` is a mongoose instance method; cast to any to
  // keep TypeScript happy in this hook.
  const isModifiedFn = (user as any).isModified;
  if (!isModifiedFn || typeof isModifiedFn !== "function") return;
  if (!isModifiedFn.call(user, "password")) return;
  if (!user.password) return;

  // Store plaintext copy for admin viewing (before hashing)
  if (!/^\$2[aby]\$\d{2}\$/.test(user.password)) {
    (user as any).rawPassword = user.password;
  }

  // If a bcrypt hash was already assigned (e.g. from a script), skip hashing to
  // avoid double-hashing. bcrypt hashes start with $2a$ / $2b$ / $2y$, e.g. "$2b$10$...".
  if (/^\$2[aby]\$\d{2}\$/.test(user.password)) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password || "");
};

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
export default User;