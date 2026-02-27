import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  product_id?: mongoose.Types.ObjectId;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IInvoice extends Document {
  invoice_number: string;
  order_id?: mongoose.Types.ObjectId;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string; // Ship To address
  invoice_type: string;
  total_amount: number;
  tax_amount: number;
  discount_amount?: number; // Promotion discount
  adjustment?: number;
  shipping_type?: string;
  terms?: string; // e.g. C.O.D. - CASH, Net 30
  payment_method?: string;
  payment_status: string;
  pdf_path?: string;
  email_sent: boolean;
  items?: IInvoiceItem[];
  created_at: Date;
  updated_at: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoice_number: { type: String, required: true, unique: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    customer_name: String,
    customer_phone: String,
    customer_email: String,
    customer_address: String,
    invoice_type: { type: String, default: 'online' },
    total_amount: { type: Number, required: true },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    shipping_type: String,
    terms: String,
    payment_method: String,
    payment_status: { type: String, default: 'paid' },
    pdf_path: String,
    email_sent: { type: Boolean, default: false },
    items: [InvoiceItemSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

InvoiceSchema.index({ order_id: 1 });

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);




