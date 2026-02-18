import mongoose, { Document, Model, Schema } from "mongoose";

export type VendorStatus = "pending" | "approved" | "rejected";

export interface IVendor extends Document {
  user: mongoose.Types.ObjectId;
  ownerName?: string;
  storeName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  description?: string;
  status: VendorStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
}

const VendorSchema: Schema<IVendor> = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    ownerName: { type: String },
    storeName: { type: String, required: true, index: true },
    contactEmail: { type: String, required: true, index: true },
    contactPhone: { type: String },
    address: { type: String },
    description: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    rejectionReason: { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

const Distributer: Model<IVendor> = (mongoose.models.Distributer as Model<IVendor>) || mongoose.model<IVendor>("Distributer", VendorSchema);
export default Distributer;
