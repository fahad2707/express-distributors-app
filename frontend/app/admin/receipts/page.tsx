'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Search, Trash2, X } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import toast from 'react-hot-toast';

interface Receipt {
  id: string;
  trx_date: string;
  trx_id: string;
  customer_id?: string;
  customer_name: string;
  state?: string;
  city?: string;
  so_id?: string;
  invoice_num?: string;
  pmt_mode: string;
  amount_received: number;
}

interface CustomerOption {
  id: string;
  name: string;
  state?: string;
  city?: string;
}

const PMT_MODES = ['Credit Card', 'COD', 'IBFT', 'Cash', 'Bank Transfer', 'Check'];

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Receipt | null>(null);
  const [form, setForm] = useState({
    trx_date: new Date().toISOString().slice(0, 10),
    trx_id: '',
    customer_id: '',
    customer_name: '',
    state: '',
    city: '',
    so_id: '',
    invoice_num: '',
    so_balance: '',
    pmt_mode: 'Credit Card',
    amount_received: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReceipts = async () => {
    try {
      const res = await adminApi.get('/receipts', { params: search ? { search } : {} });
      setReceipts(res.data.receipts || []);
    } catch {
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await adminApi.get('/customers', { params: { limit: 500 } });
      setCustomers((res.data.customers || []).map((c: any) => ({ id: c.id, name: c.name, state: c.state, city: c.city })));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [search]);

  useEffect(() => {
    if (showModal) fetchCustomers();
  }, [showModal]);

  const generateTrxId = async () => {
    try {
      const res = await adminApi.get('/receipts/generate-id');
      setForm((f) => ({ ...f, trx_id: res.data.trx_id }));
    } catch {
      setForm((f) => ({ ...f, trx_id: 'RT' + Date.now().toString(36).toUpperCase().slice(-5) }));
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const c = customers.find((x) => x.id === customerId);
    if (c) {
      setForm((f) => ({
        ...f,
        customer_id: c.id,
        customer_name: c.name,
        state: c.state || '',
        city: c.city || '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name?.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!form.amount_received || Number(form.amount_received) <= 0) {
      toast.error('Amount received is required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        trx_date: form.trx_date,
        trx_id: form.trx_id || undefined,
        customer_id: form.customer_id || undefined,
        customer_name: form.customer_name,
        state: form.state || undefined,
        city: form.city || undefined,
        so_id: form.so_id || undefined,
        invoice_num: form.invoice_num || undefined,
        so_balance: form.so_balance ? Number(form.so_balance) : undefined,
        pmt_mode: form.pmt_mode,
        amount_received: Number(form.amount_received),
      };
      if (editing) {
        await adminApi.put(`/receipts/${editing.id}`, payload);
        toast.success('Receipt updated');
      } else {
        await adminApi.post('/receipts', payload);
        toast.success('Receipt created');
      }
      setShowModal(false);
      setEditing(null);
      setForm({
        trx_date: new Date().toISOString().slice(0, 10),
        trx_id: '',
        customer_id: '',
        customer_name: '',
        state: '',
        city: '',
        so_id: '',
        invoice_num: '',
        so_balance: '',
        pmt_mode: 'Credit Card',
        amount_received: '',
      });
      fetchReceipts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (r: Receipt) => {
    setEditing(r);
    setForm({
      trx_date: r.trx_date?.toString().slice(0, 10) || new Date().toISOString().slice(0, 10),
      trx_id: r.trx_id,
      customer_id: r.customer_id || '',
      customer_name: r.customer_name || '',
      state: r.state || '',
      city: r.city || '',
      so_id: r.so_id || '',
      invoice_num: r.invoice_num || '',
      so_balance: '',
      pmt_mode: r.pmt_mode || 'Credit Card',
      amount_received: String(r.amount_received ?? ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this receipt?')) return;
    try {
      await adminApi.delete(`/receipts/${id}`);
      toast.success('Receipt deleted');
      fetchReceipts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    const x = new Date(d);
    return x.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Cash and Bank Module</h1>
      <p className="text-gray-600 mt-1">Create Receipts and Payments</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm({
              trx_date: new Date().toISOString().slice(0, 10),
              trx_id: '',
              customer_id: '',
              customer_name: '',
              state: '',
              city: '',
              so_id: '',
              invoice_num: '',
              so_balance: '',
              pmt_mode: 'Credit Card',
              amount_received: '',
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]"
        >
          <Plus className="w-4 h-4" />
          New Receipt
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
        />
        <button
          type="button"
          onClick={() => fetchReceipts()}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium bg-[#0f766e]"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          type="button"
          onClick={() => setSearch('')}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
        >
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
                  <th className="text-left py-3 px-4 text-sm font-medium">Trx Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Trx ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Customer ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Customer Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">State</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">City</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">SO ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Invoice Num</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">PMT Mode</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Amount Received</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      No receipts yet. Click &quot;New Receipt&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  receipts.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 text-sm">{formatDate(r.trx_date)}</td>
                      <td className="py-2 px-4 text-sm">{r.trx_id}</td>
                      <td className="py-2 px-4 text-sm">{r.customer_id || '—'}</td>
                      <td className="py-2 px-4 text-sm">{r.customer_name}</td>
                      <td className="py-2 px-4 text-sm">{r.state || '—'}</td>
                      <td className="py-2 px-4 text-sm">{r.city || '—'}</td>
                      <td className="py-2 px-4 text-sm">{r.so_id || '—'}</td>
                      <td className="py-2 px-4 text-sm">{r.invoice_num || '—'}</td>
                      <td className="py-2 px-4 text-sm">{r.pmt_mode}</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(r.amount_received).toLocaleString()}</td>
                      <td className="py-2 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="text-[#0f766e] hover:underline text-sm font-medium mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="text-gray-500 hover:text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Receipt' : 'New Receipt'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trx Date *</label>
                <input
                  type="date"
                  value={form.trx_date}
                  onChange={(e) => setForm((f) => ({ ...f, trx_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trx ID *</label>
                  <input
                    type="text"
                    value={form.trx_id}
                    onChange={(e) => setForm((f) => ({ ...f, trx_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g. RT31330"
                  />
                </div>
                <div className="pt-7">
                  <button type="button" onClick={generateTrxId} className="px-3 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700">
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <select
                  value={form.customer_id || ''}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {form.customer_name && !customers.some((c) => c.id === form.customer_id) && (
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    placeholder="Or type name"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  value={form.customer_id}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SO ID</label>
                <input
                  type="text"
                  value={form.so_id}
                  onChange={(e) => setForm((f) => ({ ...f, so_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. SO56816"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Num</label>
                <input
                  type="text"
                  value={form.invoice_num}
                  onChange={(e) => setForm((f) => ({ ...f, invoice_num: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SO Balance</label>
                <input
                  type="number"
                  value={form.so_balance}
                  onChange={(e) => setForm((f) => ({ ...f, so_balance: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PMT Mode *</label>
                <select
                  value={form.pmt_mode}
                  onChange={(e) => setForm((f) => ({ ...f, pmt_mode: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {PMT_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received *</label>
                <input
                  type="number"
                  value={form.amount_received}
                  onChange={(e) => setForm((f) => ({ ...f, amount_received: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57] disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
