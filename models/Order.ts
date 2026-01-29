import mongoose, { Document, Model, Schema } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "card";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name?: string;
  line1?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  shippingAddress?: IShippingAddress;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new mongoose.Schema<IOrderItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const ShippingSchema = new mongoose.Schema<IShippingAddress>({
  name: String,
  line1: String,
  city: String,
  postalCode: String,
  phone: String,
}, { _id: false });

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
    shippingAddress: { type: ShippingSchema },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;