import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  clientId: mongoose.Types.ObjectId;
  number: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  dueDate: Date;
  paidAt?: Date;
  items: IInvoiceItem[];
  createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    number: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "paid", "overdue", "cancelled"], default: "pending" },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
