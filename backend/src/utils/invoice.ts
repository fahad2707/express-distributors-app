// Utility functions for invoice generation
export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

export const formatInvoiceFilename = (
  invoiceNumber: string,
  date: Date,
  customerName?: string
): string => {
  const dateStr = date.toISOString().split('T')[0];
  const customer = customerName
    ? customerName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    : 'customer';
  return `${invoiceNumber}_${dateStr}_${customer}.pdf`;
};




