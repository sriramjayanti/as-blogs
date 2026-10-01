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
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Star,
  Check,
} from 'lucide-react';
import ImageUploadPicker from '@/components/admin/ImageUploadPicker';

export interface MarketplaceLink {
  name: string;
  url: string;
  badge?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  productUrl: string;
  marketplaceLinks: string; // JSON
  tags: string;
  isFeatured: boolean;
  orderIndex: number;
}

const COMMON_MARKETPLACES = [
  { name: 'Amazon', placeholder: 'https://amazon.in/dp/...' },
  { name: 'Blinkit', placeholder: 'https://blinkit.com/prn/...' },
  { name: 'Zepto', placeholder: 'https://zeptonow.com/pn/...' },
  { name: 'BigBasket', placeholder: 'https://bigbasket.com/pd/...' },
  { name: 'Instamart', placeholder: 'https://swiggy.com/instamart/...' },
];

export default function ProductListWithEdit({
  initialProducts,
}: {
  initialProducts: ProductItem[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form states (used for both Upload and Edit)
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formProductUrl, setFormProductUrl] = useState('https://asbrandoils.com/');
  const [formTags, setFormTags] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formOrderIndex, setFormOrderIndex] = useState(0);
  const [formMarketplaces, setFormMarketplaces] = useState<MarketplaceLink[]>([]);

  // Submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Custom marketplace helper
  const [customMpName, setCustomMpName] = useState('');
  const [customMpUrl, setCustomMpUrl] = useState('');

  // Open "Upload New Product" Modal
  const openUploadModal = () => {
    setFormName('');
    setFormSlug('');
    setFormImageUrl('');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormProductUrl('https://asbrandoils.com/');
    setFormTags('Asafoetida, Spices, Pure');
    setFormIsFeatured(true);
    setFormOrderIndex(products.length);
    setFormMarketplaces([]);
    setSubmitError('');
    setSubmitSuccess('');
    setIsUploadOpen(true);
  };

  // Open "Edit Product" Modal
  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSlug(prod.slug);
    setFormImageUrl(prod.imageUrl);
    setFormShortDesc(prod.shortDescription || '');
    setFormFullDesc(prod.fullDescription || '');
    setFormProductUrl(prod.productUrl || 'https://asbrandoils.com/');
    setFormTags(prod.tags || '');
    setFormIsFeatured(Boolean(prod.isFeatured));
    setFormOrderIndex(prod.orderIndex || 0);

    try {
      setFormMarketplaces(JSON.parse(prod.marketplaceLinks || '[]'));
    } catch {
      setFormMarketplaces([]);
    }

    setSubmitError('');
    setSubmitSuccess('');
  };

  const closeModals = () => {
    setIsUploadOpen(false);
    setEditingProduct(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingProduct) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generated);
    }
  };

  // Marketplace links helpers
  const handleAddOrUpdateMarketplace = (name: string, url: string) => {
    if (!url.trim()) {
      setFormMarketplaces((prev) => prev.filter((m) => m.name !== name));
      return;
    }
    setFormMarketplaces((prev) => {
      const exists = prev.find((m) => m.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return prev.map((m) =>
          m.name.toLowerCase() === name.toLowerCase() ? { ...m, url: url.trim() } : m
        );
      } else {
        return [...prev, { name, url: url.trim() }];
      }
    });
  };

  const handleRemoveMarketplace = (name: string) => {
    setFormMarketplaces((prev) => prev.filter((m) => m.name !== name));
  };

  const handleAddCustomMarketplace = () => {
    if (!customMpName.trim() || !customMpUrl.trim()) return;
    handleAddOrUpdateMarketplace(customMpName.trim(), customMpUrl.trim());
    setCustomMpName('');
    setCustomMpUrl('');
  };

  // Handle Create Product Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      setSubmitError('Please select or upload a product photo.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
          shortDescription: formShortDesc,
          fullDescription: formFullDesc || formShortDesc,
          imageUrl: formImageUrl,
          productUrl: formProductUrl || 'https://asbrandoils.com/',
          marketplaceLinks: JSON.stringify(formMarketplaces),
          tags: formTags,
          isFeatured: formIsFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create product');
      } else {
        setSubmitSuccess('Product uploaded successfully!');
        setProducts((prev) => [...prev, data.product]);
        setTimeout(() => {
          closeModals();
        }, 800);
      }
    } catch {
      setSubmitError('Network error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Product Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!formImageUrl) {
      setSubmitError('Please select or upload a product photo.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          shortDescription: formShortDesc,
          fullDescription: formFullDesc,
          imageUrl: formImageUrl,
          productUrl: formProductUrl,
          marketplaceLinks: JSON.stringify(formMarketplaces),
          tags: formTags,
          isFeatured: formIsFeatured,
          orderIndex: formOrderIndex,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to update product');
      } else {
        setSubmitSuccess('Product & links updated successfully!');
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
        );
        setTimeout(() => {
          closeModals();
        }, 800);
      }
    } catch {
      setSubmitError('Network error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? All linked promotion rules will also be removed.')) {
      return;
    }

    setDeletingProductId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (editingProduct?.id === id) {
          closeModals();
        }
      } else {
        alert('Failed to delete product.');
      }
    } catch {
      alert('Network error deleting product.');
    } finally {
      setDeletingProductId(null);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFeatured =
      filterFeatured === null ? true : p.isFeatured === filterFeatured;
    return matchesSearch && matchesFeatured;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar: Search, Filters & Primary "Upload New Product" Action */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, spices, or keywords..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => setFilterFeatured(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterFeatured === null
                  ? 'bg-stone-800 text-gold-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterFeatured === true
                  ? 'bg-stone-800 text-gold-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Star className="w-3 h-3 text-gold-400" /> Featured
            </button>
          </div>
        </div>

        {/* Primary Upload Button */}
        <button
          type="button"
          onClick={openUploadModal}
          className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Upload New Product
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-stone-950/60 border border-stone-800 rounded-3xl p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg text-stone-200">No products found</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            {searchQuery
              ? `No products matched "${searchQuery}". Try a different keyword.`
              : 'Start by uploading your first A.S. Brand product to showcase across recipe articles.'}
          </p>
          <button
            type="button"
            onClick={openUploadModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Upload Product Now
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            let marketplaces: MarketplaceLink[] = [];
            try {
              marketplaces = JSON.parse(prod.marketplaceLinks || '[]');
            } catch {
              marketplaces = [];
            }

            return (
              <div
                key={prod.id}
                className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between hover:border-gold-500/40 transition-all shadow-lg group relative"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 bg-white rounded-2xl p-3 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Quick Action Badges */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="bg-stone-900/90 hover:bg-gold-500 hover:text-stone-950 text-gold-400 p-2 rounded-xl border border-stone-700/80 transition-all shadow-md cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        title="Change Photo & Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>

                    {prod.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 bg-gold-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                        <Star className="w-3 h-3 fill-stone-950" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                        {prod.tags ? prod.tags.split(',')[0] : 'Product'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Slug: /{prod.slug}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-100 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions & Links */}
                <div className="mt-6 pt-4 border-t border-stone-800 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="w-full flex items-center justify-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-stone-950 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit & Links
                    </button>

                    <a
                      href={prod.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold py-2.5 rounded-xl border border-stone-800 transition-colors"
                    >
                      Store Link <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                    </a>
                  </div>

                  {/* Marketplaces Section */}
                  <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-stone-400" /> Verified Marketplaces:
                      </span>
                      <span className="text-stone-400 font-normal">
                        {marketplaces.length} active
                      </span>
                    </div>

                    {marketplaces.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {marketplaces.map((mp) => (
                          <a
                            key={mp.name}
                            href={mp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-800 hover:border-gold-500/50 transition-colors flex items-center gap-1"
                          >
                            <span>{mp.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-stone-500" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-600 italic">
                        No marketplace links set yet (click Edit & Links to add)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: UPLOAD NEW PRODUCT OR EDIT EXISTING PRODUCT             */}
      {/* ============================================================== */}
      {(isUploadOpen || editingProduct) && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
                  {isUploadOpen ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    {isUploadOpen ? 'Upload New A.S. Brand Product' : 'Edit Product Photo & Marketplace Links'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {isUploadOpen
                      ? 'Upload product image, set title, tags, and attach verified purchase channels'
                      : `Managing: ${editingProduct?.name}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={isUploadOpen ? handleCreateSubmit : handleEditSubmit}
              className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs"
            >
              {submitError && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {/* 1. PHOTO CHANGER / UPLOADER (Full Drag-and-drop, Device upload, and Gallery picker) */}
              <ImageUploadPicker
                value={formImageUrl}
                onChange={(url) => setFormImageUrl(url)}
                label="Product Display Photo (Upload File or Pick from Gallery)"
              />

              {/* 2. Product Name & Slug */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. A.S. Brand Compounded Asafoetida Powder 100g"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 shadow-inner font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. as-brand-asafoetida-100g"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono shadow-inner"
                  />
                </div>
              </div>

              {/* 3. Tags & Destination URL */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gold-400" />
                    <span>Tags (Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. Asafoetida, Spices, Hing, Pure, Digestive"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-gold-400" />
                    <span>Official Product Destination URL</span>
                  </label>
                  <input
                    type="text"
                    value={formProductUrl}
                    onChange={(e) => setFormProductUrl(e.target.value)}
                    placeholder="https://asbrandoils.com/products/..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              {/* 4. Short & Full Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Short Catchphrase / Tagline (Recipe Cards Summary) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="e.g. Pure compounded asafoetida with robust aroma for South Indian sambars and dals."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Full Description (Optional product narrative)
                  </label>
                  <textarea
                    rows={3}
                    value={formFullDesc}
                    onChange={(e) => setFormFullDesc(e.target.value)}
                    placeholder="Detailed aroma profile, quality extraction methods, and culinary benefits..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* 5. Marketplace Links Section (Amazon, Blinkit, Zepto, BigBasket, Instamart) */}
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gold-400" />
                    <h4 className="font-serif text-sm font-bold text-stone-100">
                      Marketplaces & Purchasing Links
                    </h4>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Buyers will see direct buy buttons for these channels
                  </span>
                </div>

                {/* Pre-set Quick Input for Major Marketplaces */}
                <div className="space-y-3">
                  {COMMON_MARKETPLACES.map((cmp) => {
                    const current = formMarketplaces.find(
                      (m) => m.name.toLowerCase() === cmp.name.toLowerCase()
                    );
                    return (
                      <div key={cmp.name} className="flex items-center gap-3">
                        <span className="w-24 text-xs font-bold text-stone-300 shrink-0">
                          {cmp.name}
                        </span>
                        <input
                          type="text"
                          value={current?.url || ''}
                          onChange={(e) => handleAddOrUpdateMarketplace(cmp.name, e.target.value)}
                          placeholder={cmp.placeholder}
                          className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono"
                        />
                        {current?.url && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMarketplace(cmp.name)}
                            className="text-red-400 hover:text-red-300 p-1 text-xs shrink-0 cursor-pointer"
                            title="Remove link"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Custom Marketplace Adder */}
                <div className="pt-3 border-t border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    + Add Custom Marketplace Channel:
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customMpName}
                      onChange={(e) => setCustomMpName(e.target.value)}
                      placeholder="Channel Name (e.g. JioMart)"
                      className="sm:w-1/3 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                    />
                    <input
                      type="text"
                      value={customMpUrl}
                      onChange={(e) => setCustomMpUrl(e.target.value)}
                      placeholder="https://jiomart.com/..."
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomMarketplace}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-gold-400 font-bold rounded-xl border border-stone-700 transition-colors cursor-pointer shrink-0"
                    >
                      Add Link
                    </button>
                  </div>
                </div>

                {/* Active Marketplace Pills */}
                {formMarketplaces.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-[10px] font-bold text-stone-500 uppercase py-1">Active:</span>
                    {formMarketplaces.map((m) => (
                      <span
                        key={m.name}
                        className="bg-forest-900/90 border border-forest-700 text-emerald-300 px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{m.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMarketplace(m.name)}
                          className="hover:text-red-400 cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Featured Toggle & Order Index */}
              <div className="flex items-center justify-between p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">
                      Featured Product Badge
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Prioritized in recipe inline recommendation boxes
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 uppercase font-semibold">
                    Order Index:
                  </span>
                  <input
                    type="number"
                    value={formOrderIndex}
                    onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                    className="w-16 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-100 text-center focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(editingProduct.id)}
                    disabled={deletingProductId === editingProduct.id}
                    className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-xl border border-red-800 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />{' '}
                        {isUploadOpen ? 'Upload & Publish Product' : 'Save Photo & Details'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
