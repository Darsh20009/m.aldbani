import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  technologies: string[];
  image: string;
  images: string[];
  results?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    category: { type: String, required: true },
    technologies: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    results: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
