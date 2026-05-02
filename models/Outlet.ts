import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutlet extends Document {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OutletSchema: Schema<IOutlet> = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String },
    address: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const Outlet: Model<IOutlet> = (mongoose.models.Outlet as Model<IOutlet>) || mongoose.model<IOutlet>("Outlet", OutletSchema);
export default Outlet;
