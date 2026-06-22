import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  price?: string;
  featured: boolean;
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    icon: { type: String, required: true },
    price: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", ServiceSchema);
