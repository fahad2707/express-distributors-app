'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Search, Trash2, X, MapPin, FolderPlus } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import toast from 'react-hot-toast';

interface Vendor {
  id: string;
  supplier_id?: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  payment_terms?: string;
  notes?: string;
  purchases?: number;
  payments?: number;
  balance?: number;
}

const TEAL = '#0f766e';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [form, setForm] = useState<Partial<Vendor>>({
    supplier_id: '',
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    payment_terms: '',
    notes: '',
  });

  const fetchVendors = async () => {
    try {
      const res = await adminApi.get('/vendors', { params: search ? { search } : {} });
      setVendors(res.data.vendors || []);
    } catch {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await adminApi.get('/vendors/locations/states');
      setStates(res.data.states || []);
    } catch {
      setStates(['Arizona', 'California', 'Florida', 'Texas']);
    }
  };

  const fetchCities = async (state?: string) => {
    try {
      const res = await adminApi.get('/vendors/locations/cities', { params: state ? { state } : {} });
      setCities(res.data.cities || []);
    } catch {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search]);

  useEffect(() => {
    if (showModal) {
      fetchStates();
      fetchCities(form.state);
    }
  }, [showModal, form.state]);

  const generateId = async () => {
    try {
      const res = await adminApi.get('/vendors/generate-id');
      setForm((f) => ({ ...f, supplier_id: res.data.supplier_id }));
    } catch {
      setForm((f) => ({ ...f, supplier_id: 'S' + Math.floor(10000 + Math.random() * 90000) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Supplier name is required');
      return;
    }
    try {
      if (editing) {
        await adminApi.put(`/vendors/${editing.id}`, form);
        toast.success('Supplier updated');
      } else {
        await adminApi.post('/vendors', form);
        toast.success('Supplier created');
      }
      setShowModal(false);
      setEditing(null);
      setForm({ supplier_id: '', name: '', contact_name: '', phone: '', email: '', address: '', city: '', state: '', zip: '', payment_terms: '', notes: '' });
      fetchVendors();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const openEdit = (v: Vendor) => {
    setEditing(v);
    setForm({
      supplier_id: v.supplier_id,
      name: v.name,
      contact_name: v.contact_name,
      phone: v.phone,
      email: v.email,
      address: v.address,
      city: v.city,
      state: v.state,
      zip: v.zip,
      payment_terms: v.payment_terms,
      notes: v.notes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this supplier?')) return;
    try {
      await adminApi.delete(`/vendors/${id}`);
      toast.success('Supplier deactivated');
      fetchVendors();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
      <p className="text-gray-600 mt-1">Add and manage your suppliers</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm({ supplier_id: '', name: '', contact_name: '', phone: '', email: '', address: '', city: '', state: '', zip: '', payment_terms: '', notes: '' });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]"
        >
          <Plus className="w-4 h-4" />
          New Supplier
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium"
        >
          <MapPin className="w-4 h-4" />
          New State
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium"
        >
          <FolderPlus className="w-4 h-4" />
          New City
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="All">All</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
        />
        <button type="button" onClick={() => fetchVendors()} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium bg-[#0f766e]">
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
                  <th className="text-left py-3 px-4 text-sm font-medium">Supplier ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Supplier Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">State</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">City</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Address</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Purchases</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Payments</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Balance</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      No suppliers yet. Click &quot;New Supplier&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  vendors.map((v, i) => (
                    <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-4 text-sm">{v.supplier_id || '—'}</td>
                      <td className="py-2 px-4 text-sm font-medium text-gray-900">{v.name}</td>
                      <td className="py-2 px-4 text-sm">{v.phone || v.contact_name || '—'}</td>
                      <td className="py-2 px-4 text-sm">{v.email || '—'}</td>
                      <td className="py-2 px-4 text-sm">{v.state || '—'}</td>
                      <td className="py-2 px-4 text-sm">{v.city || '—'}</td>
                      <td className="py-2 px-4 text-sm max-w-[200px] truncate">{v.address || '—'}</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(v.purchases ?? 0).toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(v.payments ?? 0).toLocaleString()}</td>
                      <td className="py-2 px-4 text-sm text-right">{Number(v.balance ?? 0).toLocaleString()}</td>
                      <td className="py-2 px-4 text-right">
                        <button type="button" onClick={() => openEdit(v)} className="text-[#0f766e] hover:underline text-sm font-medium mr-2">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline text-sm">
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
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier ID *</label>
                  <input
                    type="text"
                    value={form.supplier_id || ''}
                    onChange={(e) => setForm((f) => ({ ...f, supplier_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="pt-7">
                  <button type="button" onClick={generateId} className="px-3 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700">
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. (480) 555-0592"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  value={form.state || ''}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, state: e.target.value, city: '' }));
                    fetchCities(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <select
                  value={form.city || ''}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {cities.length === 0 && (
                  <input
                    type="text"
                    value={form.city || ''}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Or type city"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Close
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]">
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