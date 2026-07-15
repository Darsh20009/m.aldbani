import mongoose, { Document, Schema } from "mongoose";

export interface IProposalItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface IProposal extends Document {
  clientId: mongoose.Types.ObjectId;
  number: string;
  title: string;
  items: IProposalItem[];
  total: number;
  currency: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  validUntil: Date;
  notes?: string;
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema = new Schema<IProposal>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    number: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    currency: { type: String, default: "SAR" },
    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "accepted", "rejected", "expired"],
      default: "draft",
    },
    validUntil: { type: Date, required: true },
    notes: { type: String },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model<IProposal>("Proposal", ProposalSchema);
