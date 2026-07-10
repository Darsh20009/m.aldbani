import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "client";
  avatar?: string;
  googleId?: string;
  appleId?: string;
  provider: "local" | "google" | "apple";
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: "" },
    phone:    { type: String },
    role:     { type: String, enum: ["admin", "client"], default: "client" },
    avatar:   { type: String },
    googleId: { type: String, sparse: true },
    appleId:  { type: String, sparse: true },
    provider: { type: String, enum: ["local", "google", "apple"], default: "local" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
