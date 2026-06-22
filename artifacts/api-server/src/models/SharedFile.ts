import mongoose, { Document, Schema } from "mongoose";

export interface ISharedFile extends Document {
  clientId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

const SharedFileSchema = new Schema<ISharedFile>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export const SharedFile = mongoose.model<ISharedFile>("SharedFile", SharedFileSchema);
