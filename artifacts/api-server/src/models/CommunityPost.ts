import mongoose, { Document, Schema } from "mongoose";

export interface IReaction {
  emoji: string;
  users: mongoose.Types.ObjectId[];
}

export interface IComment {
  _id: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface ICommunityPost extends Document {
  title: string;
  content: string;
  type: "article" | "news" | "update" | "announcement";
  image?: string;
  reactions: IReaction[];
  comments: IComment[];
  seenBy: mongoose.Types.ObjectId[];
  publishedAt: Date;
  createdAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["article", "news", "update", "announcement"], default: "update" },
    image: { type: String },
    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    comments: [
      {
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model<ICommunityPost>("CommunityPost", CommunityPostSchema);
