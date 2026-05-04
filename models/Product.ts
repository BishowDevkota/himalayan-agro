import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  brand?: string;
  price: number;
  unit?: string;
  category?: string;
  images: string[];
  stock: number;
  isActive: boolean;
  outlet?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    brand: { type: String, index: true },
    price: { type: Number, required: true, default: 0 },
    unit: { type: String, default: "" },
    category: { type: String, index: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    outlet: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet", index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", brand: "text", category: 1 });

const Product: Model<IProduct> = (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;