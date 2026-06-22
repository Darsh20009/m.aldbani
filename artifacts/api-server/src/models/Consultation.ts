import mongoose, { Document, Schema } from "mongoose";

export interface IConsultation extends Document {
  clientId?: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  adminNotes?: string;
  meetingLink?: string;
  price?: number;
  paid: boolean;
  createdAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User" },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true, default: 60 },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    notes: { type: String },
    adminNotes: { type: String },
    meetingLink: { type: String },
    price: { type: Number },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model<IConsultation>("Consultation", ConsultationSchema);
