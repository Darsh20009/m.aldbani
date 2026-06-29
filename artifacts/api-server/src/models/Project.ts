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
  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  videoUrl: string;
  client: string;
  year: number;
  results?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title:          { type: String, required: true },
    titleAr:        { type: String, default: "" },
    description:    { type: String, default: "" },
    descriptionAr:  { type: String, default: "" },
    category:       { type: String, default: "" },
    technologies:   [{ type: String }],
    image:          { type: String, default: "" },
    images:         [{ type: String }],
    logoUrl:        { type: String, default: "" },
    websiteUrl:     { type: String, default: "" },
    instagramUrl:   { type: String, default: "" },
    twitterUrl:     { type: String, default: "" },
    linkedinUrl:    { type: String, default: "" },
    videoUrl:       { type: String, default: "" },
    client:         { type: String, default: "" },
    year:           { type: Number, default: new Date().getFullYear() },
    results:        { type: String },
    featured:       { type: Boolean, default: false },
    order:          { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
