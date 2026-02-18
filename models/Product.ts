import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  brand?: string;
  price: number;
  category?: string;
  images: string[];
  stock: number;
  isActive: boolean;
  distributor?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    brand: { type: String, index: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, index: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    distributor: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", brand: "text", category: 1 });

const Product: Model<IProduct> = (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;