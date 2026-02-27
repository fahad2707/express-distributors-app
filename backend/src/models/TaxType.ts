import mongoose, { Schema, Document } from 'mongoose';

export interface ITaxType extends Document {
  name: string;
  rate: number; // e.g. 8.5 for 8.5%
  created_at: Date;
  updated_at: Date;
}

const TaxTypeSchema = new Schema<ITaxType>(
  {
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<ITaxType>('TaxType', TaxTypeSchema);
