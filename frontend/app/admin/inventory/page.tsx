'use client';

import { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, X, Tag, FolderPlus, Layers } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  sku?: string;
  name: string;
  category_name?: string;
  sub_category_name?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  category_id?: string;
  sub_category_id?: string;
}

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({
    item_id: '',
    item_type: '',
    item_category: '',
    item_subcategory: '',
    item_name: '',
    reorder_level: '10',
  });

  const fetchProducts = async () => {
    try {
      const res = await adminApi.get('/products', { params: { limit: 500 } });
      const list = (res.data.products || []).map((p: any) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category_name: p.category_name,
        sub_category_name: p.sub_category_name,
        stock_quantity: p.stock_quantity ?? 0,
        low_stock_threshold: p.low_stock_threshold ?? 10,
        category_id: p.category_id,
        sub_category_id: p.sub_category_id,
      }));
      setItems(list);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await adminApi.get('/sub-categories');
      setSubCategories(res.data || []);
    } catch {
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showItemModal || showCategoryModal || showSubcategoryModal) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [showItemModal, showCategoryModal, showSubcategoryModal]);

  const generateItemId = async () => {
    try {
      const res = await adminApi.get('/products/generate-id');
      setForm((f) => ({ ...f, item_id: res.data.item_id }));
    } catch {
      setForm((f) => ({ ...f, item_id: 'P' + Math.floor(10000 + Math.random() * 90000) }));
    }
  };

  const filtered = items.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.item_name?.trim()) {
      toast.error('Item name is required');
      return;
    }
    try {
      if (editing) {
        await adminApi.put(`/products/${editing.id}`, {
          name: form.item_name,
          category_id: form.item_category || undefined,
          sub_category_id: form.item_subcategory || undefined,
          low_stock_threshold: parseInt(form.reorder_level, 10) || 10,
        });
        toast.success('Item updated');
      } else {
        await adminApi.post('/products', {
          name: form.item_name,
          sku: form.item_id || undefined,
          category_id: form.item_category || undefined,
          sub_category_id: form.item_subcategory || undefined,
          low_stock_threshold: parseInt(form.reorder_level, 10) || 10,
          price: 0.01,
          stock_quantity: 0,
        });
        toast.success('Item added');
      }
      setShowItemModal(false);
      setEditing(null);
      setForm({ item_id: '', item_type: '', item_category: '', item_subcategory: '', item_name: '', reorder_level: '10' });
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditing(item);
    setForm({
      item_id: item.sku || item.id,
      item_type: item.category_id || '',
      item_category: item.category_id || '',
      item_subcategory: item.sub_category_id || '',
      item_name: item.name,
      reorder_level: String(item.low_stock_threshold ?? 10),
    });
    setShowItemModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this item? It can be reactivated later.')) return;
    try {
      await adminApi.delete(`/products/${id}`);
      toast.success('Item deactivated');
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const qtyPurchased = 0; // placeholder
  const qtySold = 0; // placeholder

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
      <p className="text-gray-600 mt-1">Add and manage your inventory items.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm({ item_id: '', item_type: '', item_category: '', item_subcategory: '', item_name: '', reorder_level: '10' });
            setShowItemModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e] hover:bg-[#0d5d57]"
        >
          <Plus className="w-4 h-4" />
          Add Inventory Item
        </button>
        <button type="button" onClick={() => setShowTypeModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium">
          <Tag className="w-4 h-4" />
          Add Item Type
        </button>
        <button type="button" onClick={() => setShowCategoryModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium">
          <FolderPlus className="w-4 h-4" />
          Add Item Category
        </button>
        <button type="button" onClick={() => setShowSubcategoryModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 font-medium">
          <Layers className="w-4 h-4" />
          Add Item Subcategory
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="All">All</option>
        </select>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48" />
        <button type="button" onClick={() => fetchProducts()} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium bg-[#0f766e]">
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
                  <th className="text-left py-3 px-4 text-sm font-medium">Item ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Item Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Item Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Item Subcategory</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Item Name</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">QTY Purchased</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">QTY Sold</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Remaining QTY</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Reorder Required</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      No inventory items. Click &quot;Add Inventory Item&quot; to add one.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => {
                    const reorderRequired = p.stock_quantity <= (p.low_stock_threshold || 10);
                    return (
                      <tr key={p.id} className={i % 2 === 0 ? (reorderRequired ? 'bg-red-50' : 'bg-white') : (reorderRequired ? 'bg-red-50/70' : 'bg-gray-50')}>
                        <td className="py-2 px-4 text-sm font-mono">{p.sku || p.id.slice(-6)}</td>
                        <td className="py-2 px-4 text-sm">{p.category_name || '—'}</td>
                        <td className="py-2 px-4 text-sm">{p.category_name || '—'}</td>
                        <td className="py-2 px-4 text-sm">{p.sub_category_name || '—'}</td>
                        <td className="py-2 px-4 text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="py-2 px-4 text-sm text-right">{qtyPurchased}</td>
                        <td className="py-2 px-4 text-sm text-right">{qtySold}</td>
                        <td className="py-2 px-4 text-sm text-right font-medium">{p.stock_quantity}</td>
                        <td className="py-2 px-4 text-sm text-right">{p.low_stock_threshold ?? 10}</td>
                        <td className="py-2 px-4 text-sm">{reorderRequired ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4 text-right">
                          <button type="button" onClick={() => openEdit(p)} className="text-[#0f766e] hover:underline text-sm font-medium mr-2">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
              <button type="button" onClick={() => setShowItemModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item ID *</label>
                  <input type="text" value={form.item_id} onChange={(e) => setForm((f) => ({ ...f, item_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div className="pt-7">
                  <button type="button" onClick={generateItemId} className="px-3 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700">
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type *</label>
                <select value={form.item_type} onChange={(e) => setForm((f) => ({ ...f, item_type: e.target.value, item_category: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select type</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Category *</label>
                <select value={form.item_category} onChange={(e) => setForm((f) => ({ ...f, item_category: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Subcategory *</label>
                <select value={form.item_subcategory} onChange={(e) => setForm((f) => ({ ...f, item_subcategory: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select subcategory</option>
                  {subCategories.filter((s) => !form.item_category || s.category_id === form.item_category).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input type="text" value={form.item_name} onChange={(e) => setForm((f) => ({ ...f, item_name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level *</label>
                <input type="number" min={0} value={form.reorder_level} onChange={(e) => setForm((f) => ({ ...f, reorder_level: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowItemModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
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

      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item Type</h3>
            <p className="text-gray-600 text-sm mb-4">Add a new category to use as Item Type. Use &quot;Add Item Category&quot; for categories.</p>
            <button type="button" onClick={() => { setShowTypeModal(false); setShowCategoryModal(true); }} className="w-full px-4 py-2 rounded-lg text-white font-medium bg-[#0f766e]">
              Go to Add Category
            </button>
            <button type="button" onClick={() => setShowTypeModal(false)} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSaved={() => {
            fetchCategories();
            setShowCategoryModal(false);
            toast.success('Category added');
          }}
        />
      )}

      {showSubcategoryModal && (
        <AddSubcategoryModal
          categories={categories}
          onClose={() => setShowSubcategoryModal(false)}
          onSaved={() => {
            fetchSubCategories();
            setShowSubcategoryModal(false);
            toast.success('Subcategory added');
          }}
        />
      )}
    </div>
  );
}

function AddCategoryModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await adminApi.post('/categories', { name: name.trim() });
      onSaved();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item Category</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4" autoFocus />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#0d5d57] disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddSubcategoryModal({ categories, onClose, onSaved }: { categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      toast.error('Name and category required');
      return;
    }
    setLoading(true);
    try {
      await adminApi.post('/sub-categories', { name: name.trim(), category_id: categoryId });
      onSaved();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add subcategory');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item Subcategory</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#0d5d57] disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
