import mongoose, { Document, Model, Schema } from "mongoose";

export type PaymentRequestStatus = "pending" | "approved" | "rejected";

export interface IPaymentRequest extends Document {
  vendor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentRequestStatus;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema: Schema<IPaymentRequest> = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

const PaymentRequest: Model<IPaymentRequest> = (mongoose.models.PaymentRequest as Model<IPaymentRequest>) || mongoose.model<IPaymentRequest>("PaymentRequest", PaymentRequestSchema);
export default PaymentRequest;
