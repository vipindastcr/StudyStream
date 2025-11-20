import mongoose, { Schema, Document } from "mongoose";
import { UserRole, User } from "@domain/entities/User";

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  passwordHash: string;
  role: UserRole;
  created_at: Date;
  last_login: Date;
  isBlocked: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone_number: { type: String, required: true },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER
    },

    created_at: { type: Date, default: Date.now },

    last_login: { type: Date, default: null },

    isBlocked: { type: Boolean, default: false }
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
