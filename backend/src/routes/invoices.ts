import express from 'express';
import Invoice from '../models/Invoice';
import StoreSettings from '../models/StoreSettings';
import { authenticateUser, authenticateAdmin, AuthRequest } from '../middleware/auth';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const router = express.Router();

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate PDF invoice (format: company header, order/ship-to, Order Items table, summary, EXPRESS DISTRIBUTORS INC watermark)
const generateInvoicePDF = async (invoice: any, items: any[]): Promise<string> => {
  const filename = `invoice-${invoice.invoice_number}.pdf`;
  const uploadsDir = path.join(__dirname, '../../uploads/invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filepath = path.join(uploadsDir, filename);
  // Remove existing file so we always output the current format (no cached old PDF)
  if (fs.existsSync(filepath)) {
    try { fs.unlinkSync(filepath); } catch (_) {}
  }

  const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
  doc.pipe(fs.createWriteStream(filepath));

  const settings = await StoreSettings.findOne().lean().catch(() => null) as any;
  const businessName = settings?.business_name || 'Express Distributors Inc';
  const addressParts = [settings?.address, settings?.city, settings?.state, settings?.zip].filter(Boolean);
  const companyAddress = addressParts.length ? addressParts.join(', ') : '';
  const companyPhone = settings?.phone || '';
  const companyWebsite = settings?.email ? '' : ''; // or add website field to settings

  // ----- Watermark: EXPRESS DISTRIBUTORS INC (diagonal, semi-transparent style behind content) -----
  doc.save();
  doc.translate(PAGE_WIDTH / 2, PAGE_HEIGHT / 2);
  doc.rotate(-45);
  doc.fillColor('#cccccc'); // Light gray so it's visible but clearly a watermark
  doc.fontSize(68);
  doc.font('Helvetica-Bold');
  doc.text('EXPRESS DISTRIBUTORS INC', -280, -26, { width: 560, align: 'center' });
  doc.restore();
  doc.fillColor('black');
  doc.font('Helvetica');

  // ----- Header: Company (left) | Address, website, phone (right) -----
  let y = MARGIN;
  doc.fontSize(24);
  doc.font('Helvetica-Bold');
  doc.text(businessName.toUpperCase(), MARGIN, y, { width: 240 });
  doc.font('Helvetica');
  doc.fontSize(12);
  doc.text('DISTRIBUTOR', MARGIN, y + 26);
  doc.fontSize(10);
  doc.text(companyAddress || '—', PAGE_WIDTH - MARGIN - 220, y, { width: 220, align: 'right' });
  doc.text(companyWebsite || 'www.expressdistributors.com', PAGE_WIDTH - MARGIN - 220, y + 14, { width: 220, align: 'right' });
  doc.text(companyPhone ? `Phone No: ${companyPhone}` : '', PAGE_WIDTH - MARGIN - 220, y + 28, { width: 220, align: 'right' });

  y += 50;
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).lineWidth(1).stroke();
  doc.lineWidth(1);
  y += 6;
  doc.fontSize(11);
  doc.font('Helvetica-Bold');
  doc.text('INVOICE', MARGIN, y);
  doc.font('Helvetica');
  y += 16;

  // ----- Order details (left) | Ship To (right) -----
  const orderDate = invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '—';
  const terms = invoice.terms || (invoice.payment_method === 'cash' ? 'C.O.D. - CASH' : invoice.payment_method || '—');
  const shippingType = invoice.shipping_type || invoice.invoice_type || 'Ground Shipping';
  doc.fontSize(10);
  doc.font('Helvetica-Bold');
  doc.text('Order No.:', MARGIN, y);
  doc.font('Helvetica');
  doc.text(invoice.invoice_number, MARGIN + 62, y);
  doc.text(`Order Date: ${orderDate}`, MARGIN, y + 14);
  doc.text(`Terms: ${terms}`, MARGIN, y + 28);
  doc.text(`Shipping Type: ${shippingType}`, MARGIN, y + 42);

  const shipToLines = [];
  if (invoice.customer_name) shipToLines.push(invoice.customer_name);
  if (invoice.customer_address) shipToLines.push(invoice.customer_address);
  if (invoice.customer_phone && !invoice.customer_address) shipToLines.push(invoice.customer_phone);
  if (invoice.customer_email) shipToLines.push(invoice.customer_email);
  const shipToText = shipToLines.length ? shipToLines.join(', ') : '—';
  doc.font('Helvetica-Bold');
  doc.text('Ship To: -', PAGE_WIDTH - MARGIN - 220, y, { width: 220, align: 'right' });
  doc.font('Helvetica');
  doc.fontSize(9);
  doc.text(shipToText, PAGE_WIDTH - MARGIN - 220, y + 12, { width: 220, align: 'right' });

  y += 58;
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
  y += 14;

  // ----- Order Items (centered title) -----
  doc.fontSize(12);
  doc.font('Helvetica-Bold');
  doc.text('Order Items', MARGIN, y, { width: CONTENT_WIDTH, align: 'center' });
  y += 20;

  // Table header
  const colQty = MARGIN;
  const colId = colQty + 36;
  const colName = colId + 42;
  const colUnitCost = PAGE_WIDTH - MARGIN - 180;
  const colPromDisc = colUnitCost + 58;
  const colTotalCost = colPromDisc + 62;
  doc.font('Helvetica');
  doc.fontSize(9);
  doc.text('Qty', colQty, y);
  doc.text('ID', colId, y);
  doc.text('Product Name-Unit Type', colName, y);
  doc.text('Unit Cost', colUnitCost, y, { width: 58, align: 'right' });
  doc.text('Prom. Disc($)', colPromDisc, y, { width: 62, align: 'right' });
  doc.text('Total Cost', colTotalCost, y, { width: 68, align: 'right' });
  y += 14;
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
  y += 10;

  const itemTotal = items.reduce((sum: number, i: any) => sum + parseFloat(i.subtotal || 0), 0);
  const discountAmount = invoice.discount_amount ?? 0;
  const taxAmount = invoice.tax_amount ?? 0;
  const adjustment = invoice.adjustment ?? 0;

  items.forEach((item: any) => {
    const productId = item.product_id ? String(item.product_id).slice(-6) : '—';
    const name = (item.product_name || 'Product') + ' - Box';
    doc.text(String(item.quantity ?? 0), colQty, y);
    doc.text(productId, colId, y);
    doc.text(name, colName, y, { width: colUnitCost - colName - 8 });
    doc.text(parseFloat(item.price || 0).toFixed(2), colUnitCost, y, { width: 58, align: 'right' });
    doc.text('0.00', colPromDisc, y, { width: 62, align: 'right' });
    doc.text(parseFloat(item.subtotal || 0).toFixed(2), colTotalCost, y, { width: 68, align: 'right' });
    y += 16;
  });

  y += 8;

  // ----- Summary (right-aligned, in a light box) -----
  const summaryX = PAGE_WIDTH - MARGIN - 180;
  const summaryY = y;
  doc.fontSize(9);
  doc.text('Item Total', summaryX, y, { width: 90, align: 'right' });
  doc.text(itemTotal.toFixed(2), summaryX + 90, y, { width: 90, align: 'right' });
  y += 14;
  doc.text('Promotion Discount Amount($)', summaryX, y, { width: 90, align: 'right' });
  doc.text(discountAmount.toFixed(2), summaryX + 90, y, { width: 90, align: 'right' });
  y += 14;
  doc.text('Tax', summaryX, y, { width: 90, align: 'right' });
  doc.text(taxAmount.toFixed(2), summaryX + 90, y, { width: 90, align: 'right' });
  y += 14;
  doc.text('Adjustment', summaryX, y, { width: 90, align: 'right' });
  doc.text(adjustment.toFixed(2), summaryX + 90, y, { width: 90, align: 'right' });
  y += 18;
  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text('Grand Total', summaryX, y, { width: 90, align: 'right' });
  doc.text(parseFloat(invoice.total_amount || 0).toFixed(2), summaryX + 90, y, { width: 90, align: 'right' });
  y += 16;
  doc.strokeColor('#cccccc');
  doc.rect(summaryX - 8, summaryY - 4, 198, y - summaryY + 8).stroke();
  doc.strokeColor('black');
  doc.font('Helvetica');

  // Page number (bottom left)
  doc.font('Helvetica');
  doc.fontSize(8);
  doc.text('Page: 1/1', MARGIN, PAGE_HEIGHT - MARGIN - 12);

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(filepath));
    doc.on('error', reject);
  });
};

// Get invoices
router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};

    if (search) {
      query.$or = [
        { invoice_number: { $regex: search, $options: 'i' } },
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_phone: { $regex: search, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Invoice.countDocuments(query);

    res.json(
      invoices.map((invoice: any) => ({
        id: invoice._id.toString(),
        invoice_number: invoice.invoice_number,
        invoice_type: invoice.invoice_type,
        customer_name: invoice.customer_name,
        customer_phone: invoice.customer_phone,
        customer_email: invoice.customer_email,
        total_amount: invoice.total_amount,
        tax_amount: invoice.tax_amount || 0,
        payment_method: invoice.payment_method,
        payment_status: invoice.payment_status,
        created_at: invoice.created_at,
        items: invoice.items || [],
      }))
    );
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Generate and download invoice PDF (must be before GET /:id so /:id/pdf is matched)
router.get('/:id/pdf', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const items = invoice.items || [];
    // Always regenerate PDF so format/watermark changes are applied (no cached file)
    const filepath = await generateInvoicePDF(invoice, items);

    if (!invoice.pdf_path) {
      await Invoice.findByIdAndUpdate(req.params.id, { pdf_path: filepath });
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.download(filepath);
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Get invoice by ID
router.get('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      id: invoice._id.toString(),
      ...invoice,
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Send invoice via email
router.post('/:id/send-email', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (!invoice.customer_email) {
      return res.status(400).json({ error: 'Customer email not found' });
    }

    const items = invoice.items || [];

    // Generate PDF if not exists
    let filepath = invoice.pdf_path;
    if (!filepath || !fs.existsSync(filepath)) {
      filepath = await generateInvoicePDF(invoice, items);
      await Invoice.findByIdAndUpdate(req.params.id, { pdf_path: filepath });
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: invoice.customer_email,
      subject: `Invoice ${invoice.invoice_number} - Express Distributors Inc`,
      text: `Please find attached your invoice ${invoice.invoice_number}.`,
      attachments: [
        {
          filename: `invoice-${invoice.invoice_number}.pdf`,
          path: filepath,
        },
      ],
    });

    await Invoice.findByIdAndUpdate(req.params.id, { email_sent: true });

    res.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send invoice email' });
  }
});

export default router;
