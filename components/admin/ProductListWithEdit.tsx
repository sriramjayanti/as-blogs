'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowUpRight,
  Edit,
  Store,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  productUrl: string;
  marketplaceLinks: string;
  tags: string;
  isFeatured: boolean;
  orderIndex: number;
}

export default function ProductListWithEdit({
  initialProducts,
}: {
  initialProducts: ProductItem[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Edit form state
  const [formName, setFormName] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formProductUrl, setFormProductUrl] = useState('');
  const [formTags, setFormTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormImageUrl(prod.imageUrl);
    setFormShortDesc(prod.shortDescription || '');
    setFormProductUrl(prod.productUrl || '');
    setFormTags(prod.tags || '');
    setSaveError('');
    setSaveSuccess('');
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          imageUrl: formImageUrl,
          shortDescription: formShortDesc,
          productUrl: formProductUrl,
          tags: formTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || 'Failed to update product');
      } else {
        setSaveSuccess('Product & photo updated successfully!');
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
        );
        setTimeout(() => {
          closeEditModal();
        }, 800);
      }
    } catch {
      setSaveError('Network error updating product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => {
          let marketplaces: { name: string; url: string; badge?: string }[] = [];
          try {
            marketplaces = JSON.parse(prod.marketplaceLinks || '[]');
          } catch {
            marketplaces = [];
          }

          return (
            <div
              key={prod.id}
              className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between hover:border-stone-700 transition-all shadow-lg"
            >
              <div>
                <div className="relative h-44 bg-white rounded-2xl p-3 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => openEditModal(prod)}
                    className="absolute top-2 right-2 bg-stone-900/90 hover:bg-gold-500 hover:text-stone-950 text-gold-400 p-2 rounded-xl border border-stone-700/80 transition-all shadow-md cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Change Photo & Edit Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                    {prod.tags ? prod.tags.split(',')[0] : 'Product'}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(prod)}
                    className="w-full flex items-center justify-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-stone-950 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit & Photo
                  </button>

                  <a
                    href={prod.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold py-2.5 rounded-xl border border-stone-800 transition-colors"
                  >
                    Destination <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                  </a>
                </div>

                {marketplaces.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Store className="w-3 h-3 text-stone-400" /> Verified Marketplaces:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {marketplaces.map((mp) => (
                        <span
                          key={mp.name}
                          className="text-[11px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded border border-stone-800"
                        >
                          {mp.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Edit Product Photo & Details
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
              {saveError && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* Photo Upload & Gallery Picker */}
              <ImageUploadPicker
                value={formImageUrl}
                onChange={(url) => setFormImageUrl(url)}
                label="Product Display Photo"
              />

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Premium, Asafoetida, Spices"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Product Destination URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Product Destination URL
                </label>
                <input
                  type="text"
                  value={formProductUrl}
                  onChange={(e) => setFormProductUrl(e.target.value)}
                  placeholder="https://asbrand.in/products/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Photo & Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
