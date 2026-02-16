import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IEmployee extends Document {
  name?: string;
  email: string;
  password?: string;
  role: string;
  permissions: string[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const EmployeeSchema: Schema<IEmployee> = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, required: true },
    permissions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EmployeeSchema.pre("save", async function () {
  const employee = this as IEmployee;
  const isModifiedFn = (employee as any).isModified;
  if (!isModifiedFn || typeof isModifiedFn !== "function") return;
  if (!isModifiedFn.call(employee, "password")) return;
  if (!employee.password) return;

  if (/^\$2[aby]\$\d{2}\$/.test(employee.password)) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(employee.password, salt);
});

EmployeeSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password || "");
};

const Employee: Model<IEmployee> = (mongoose.models.Employee as Model<IEmployee>) || mongoose.model<IEmployee>("Employee", EmployeeSchema);
export default Employee;
