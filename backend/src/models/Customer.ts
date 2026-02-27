import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  billing_address?: string; // Billing address (full or same as address)
  shipping_address?: string; // Shipping address
  tax_id?: string; // Tax ID / EIN for B2B
  tax_exempt?: boolean; // If true, skip tax on sales
  payment_terms?: string; // e.g. "Net 30"
  credit_limit?: number;
  outstanding_balance?: number; // Sum of unpaid invoices minus credits
  notes?: string;
  user_id?: mongoose.Types.ObjectId; // Link to User if has online account
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    company: String,
    phone: { type: String, required: true },
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    billing_address: String,
    shipping_address: String,
    tax_id: String,
    tax_exempt: { type: Boolean, default: false },
    payment_terms: String,
    credit_limit: Number,
    outstanding_balance: { type: Number, default: 0 },
    notes: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ name: 'text', company: 'text' });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
