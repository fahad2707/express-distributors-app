import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name?: string;
  email?: string;
  password_hash?: string;
  loyalty_points: number;
  total_spent: number;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
    password_hash: String,
    loyalty_points: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default mongoose.model<IUser>('User', UserSchema);
