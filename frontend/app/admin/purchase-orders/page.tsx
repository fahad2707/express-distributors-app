'use client';

import { useEffect, useState } from 'react';
import { Plus, Eye, FileText, Truck, Search, X } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface POItem {
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_received?: number;
  unit_cost: number;
  subtotal: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  supplier_id?: string;
  state?: string;
  city?: string;
  status: string;
  items: POItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
}

interface Vendor {
  id: string;
  supplier_id?: string;
  name: string;
  state?: string;
  city?: string;
}

interface Product {
  id: string;
  name: string;
}

interface CreateRow {
  product_id: string;
  product_name: string;
  qty: number;
  unit_cost: number;
  cost_excl_tax: number;
  tax_rate: number;
  total_tax: number;
  cost_incl_tax: number;
  shipping: number;
  total_price: number;
}

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendorId, setVendorId] = useState('');
  const [billNum, setBillNum] = useState('');
  const [rows, setRows] = useState<CreateRow[]>([]);

  const fetchPOs = async () => {
    try {
      const res = await adminApi.get('/purchase-orders', { params: search ? { search } : {} });
      setPos(res.data.purchase_orders || []);
    } catch {
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await adminApi.get('/vendors');
      setVendors(res.data.vendors || []);
    } catch {
      toast.error('Failed to load vendors');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await adminApi.get('/products');
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchPOs();
  }, [search]);

  useEffect(() => {
    if (showCreate) {
      fetchVendors();
      fetchProducts();
    }
  }, [showCreate]);

  const selectedVendor = vendors.find((v) => v.id === vendorId);

  const generatePoId = async () => {
    try {
      const res = await adminApi.get('/purchase-orders/generate-id');
      setPoNumber(res.data.po_number);
    } catch {
      setPoNumber('P' + Math.floor(10000 + Math.random() * 90000));
    }
  };

  const addRow = () => {
    const first = products[0];
    setRows([
      ...rows,
      {
        product_id: first?.id ?? '',
        product_name: first?.name ?? '',
        qty: 1,
        unit_cost: 0,
        cost_excl_tax: 0,
        tax_rate: 0,
        total_tax: 0,
        cost_incl_tax: 0,
        shipping: 0,
        total_price: 0,
      },
    ]);
  };

  const updateRow = (idx: number, field: keyof CreateRow, value: string | number) => {
    const next = [...rows];
    const r = { ...next[idx], [field]: value };
    if (field === 'product_id') {
      const p = products.find((x) => x.id === value);
      r.product_name = p?.name ?? r.product_name;
    }
    if (field === 'qty' || field === 'unit_cost') {
      const qty = field === 'qty' ? Number(value) : next[idx].qty;
      const cost = field === 'unit_cost' ? Number(value) : next[idx].unit_cost;
      r.cost_excl_tax = qty * cost;
      r.tax_rate = next[idx].tax_rate;
      r.total_tax = Math.round(r.cost_excl_tax * (r.tax_rate / 100) * 100) / 100;
      r.cost_incl_tax = r.cost_excl_tax + r.total_tax;
      r.shipping = next[idx].shipping;
      r.total_price = r.cost_incl_tax + r.shipping;
    }
    if (field === 'tax_rate') {
      r.tax_rate = Number(value);
      r.total_tax = Math.round(r.cost_excl_tax * (r.tax_rate / 100) * 100) / 100;
      r.cost_incl_tax = r.cost_excl_tax + r.total_tax;
      r.total_price = r.cost_incl_tax + r.shipping;
    }
    if (field === 'shipping') {
      r.shipping = Number(value);
      r.total_price = r.cost_incl_tax + r.shipping;
    }
    next[idx] = r;
    setRows(next);
  };

  const removeRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleSavePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || rows.length === 0) {
      toast.error('Select supplier and add at least one item');
      return;
    }
    if (rows.some((r) => !r.product_id || r.qty <= 0 || r.unit_cost < 0)) {
      toast.error('Fill in product, quantity, and unit cost for all items');
      return;
    }
    try {
      await adminApi.post('/purchase-orders', {
        po_number: poNumber || undefined,
        vendor_id: vendorId,
        items: rows.map((r) => ({
          product_id: r.product_id,
          product_name: r.product_name,
          quantity_ordered: r.qty,
          unit_cost: r.unit_cost,
        })),
        tax_amount: rows.reduce((s, r) => s + r.total_tax, 0),
        notes: billNum ? `Bill #${billNum}` : undefined,
      });
      toast.success('PO saved');
      setShowCreate(false);
      setPoNumber('');
      setPoDate(new Date().toISOString().slice(0, 10));
      setVendorId('');
      setBillNum('');
      setRows([]);
      fetchPOs();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save PO');
    }
  };

  const pmtStatus = (po: PurchaseOrder) => {
    if (po.status === 'received') return 'Paid';
    if (po.status === 'partial') return 'Partial PMT';
    return 'Pending';
  };

  const shippingStatus = (po: PurchaseOrder) => {
    if (po.status === 'received') return 'Received';
    if (po.status === 'partial') return 'Partial';
    return 'Pending';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
      <p className="text-gray-600 mt-1">Create and manage your purchase orders.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setShowCreate(true);
            setPoNumber('');
            setPoDate(new Date().toISOString().slice(0, 10));
            setVendorId('');
            setBillNum('');
            setRows([]);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]"
        >
          <Plus className="w-4 h-4" />
          New PO
        </button>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium">
          <FileText className="w-4 h-4" />
          PMT Status
        </button>
        <button type="button" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium">
          <Truck className="w-4 h-4" />
          Shipping Status
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="All">All</option>
        </select>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48" />
        <button type="button" onClick={() => fetchPOs()} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium bg-[#0f766e]">
          <Search className="w-4 h-4" />
          Search
        </button>
        <button type="button" onClick={() => setSearch('')} className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
          Clear
        </button>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0f766e] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0f766e] text-white">
                  <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">PO ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Supplier ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Supplier Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Bill Num</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">State</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">City</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Total Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Total Paid</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">PO Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">PMT Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Shipping Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pos.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-8 text-center text-gray-500">
                      No purchase orders. Click &quot;New PO&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  pos.map((po, i) => (
                    <tr key={po.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 text-sm">{po.created_at ? new Date(po.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                      <td className="py-2 px-4 text-sm font-medium">{po.po_number}</td>
                      <td className="py-2 px-4 text-sm">{po.supplier_id || '—'}</td>
                      <td className="py-2 px-4 text-sm">{po.vendor_name}</td>
                      <td className="py-2 px-4 text-sm">—</td>
                      <td className="py-2 px-4 text-sm">{po.state || '—'}</td>
                      <td className="py-2 px-4 text-sm">{po.city || '—'}</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(po.total_amount || 0).toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-right">0</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(po.total_amount || 0).toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm">{pmtStatus(po)}</td>
                      <td className="py-2 px-4 text-sm">{shippingStatus(po)}</td>
                      <td className="py-2 px-4 text-right">
                        <Link href={`/admin/purchase-orders/${po.id}`} className="inline-flex items-center gap-1 text-[#0f766e] hover:underline text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create New PO</h2>
            </div>

            <form onSubmit={handleSavePO} className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">PO ID *</label>
                      <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="e.g. P087684" />
                    </div>
                    <div className="pt-7">
                      <button type="button" onClick={generatePoId} className="px-3 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700">
                        Generate
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PO Date *</label>
                    <input type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                    <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                      <option value="">Select supplier</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID</label>
                    <input type="text" value={selectedVendor?.supplier_id ?? ''} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" value={selectedVendor?.state ?? ''} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={selectedVendor?.city ?? ''} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Num</label>
                    <input type="text" value={billNum} onChange={(e) => setBillNum(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">PO Items</h3>
                  <button type="button" onClick={addRow} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium bg-[#0f766e] hover:bg-[#0d5d57]">
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Item Name</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">QTY</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Unit Cost</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Cost Excl Tax</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Tax Rate %</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Total Tax</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Cost Incl Tax</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Shipping</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Total Price</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="py-1 px-3">
                            <select
                              value={r.product_id}
                              onChange={(e) => updateRow(idx, 'product_id', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="">Select Item</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-1 px-3 text-right">
                            <input type="number" min={1} value={r.qty} onChange={(e) => updateRow(idx, 'qty', e.target.value)} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                          </td>
                          <td className="py-1 px-3 text-right">
                            <input type="number" min={0} step={0.01} value={r.unit_cost || ''} onChange={(e) => updateRow(idx, 'unit_cost', e.target.value)} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                          </td>
                          <td className="py-1 px-3 text-right text-sm">{r.cost_excl_tax.toFixed(2)}</td>
                          <td className="py-1 px-3 text-right">
                            <input type="number" min={0} max={100} step={0.5} value={r.tax_rate || ''} onChange={(e) => updateRow(idx, 'tax_rate', e.target.value)} className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                          </td>
                          <td className="py-1 px-3 text-right text-sm">{r.total_tax.toFixed(2)}</td>
                          <td className="py-1 px-3 text-right text-sm">{r.cost_incl_tax.toFixed(2)}</td>
                          <td className="py-1 px-3 text-right">
                            <input type="number" min={0} step={0.01} value={r.shipping || ''} onChange={(e) => updateRow(idx, 'shipping', e.target.value)} className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right" />
                          </td>
                          <td className="py-1 px-3 text-right text-sm font-medium">{r.total_price.toFixed(2)}</td>
                          <td className="py-1 px-3">
                            <button type="button" onClick={() => removeRow(idx)} className="text-red-600 hover:bg-red-50 rounded p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Close
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]">
                  Save PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
