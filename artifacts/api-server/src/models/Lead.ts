import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "in-contact" | "client" | "rejected";
  notes?: string;
  value?: number;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: { type: String, required: true, default: "website" },
    status: { type: String, enum: ["new", "in-contact", "client", "rejected"], default: "new" },
    notes: { type: String },
    value: { type: Number },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
