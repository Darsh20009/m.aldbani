import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  category: string;
  coverImage: string;
  readTime: number;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    excerptAr: { type: String, required: true },
    content: { type: String, required: true },
    contentAr: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>("Article", ArticleSchema);
