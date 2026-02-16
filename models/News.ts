import mongoose, { Document, Model, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  contentHtml: string;
  status: "draft" | "published";
  authorName?: string;
  authorEmail?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema<INews> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    coverImage: { type: String },
    category: { type: String },
    contentHtml: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    authorName: { type: String },
    authorEmail: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

const News: Model<INews> = (mongoose.models.News as Model<INews>) || mongoose.model<INews>("News", NewsSchema);
export default News;
