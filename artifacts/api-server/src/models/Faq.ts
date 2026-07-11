import mongoose, { Document, Schema } from "mongoose";

export interface IFaq extends Document {
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  source: "manual" | "feedback";
  published: boolean;
  order: number;
}

const FaqSchema = new Schema<IFaq>(
  {
    question:   { type: String, required: true },
    questionAr: { type: String, required: true },
    answer:     { type: String, required: true },
    answerAr:   { type: String, required: true },
    source:     { type: String, enum: ["manual", "feedback"], default: "manual" },
    published:  { type: Boolean, default: true },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Faq = mongoose.model<IFaq>("Faq", FaqSchema);
