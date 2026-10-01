'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Store,
  Layers,
  Search,
  Filter,
  Sliders,
  Check,
  X,
  Save,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export interface PromotionRuleItem {
  id: string;
  name: string;
  keywords: string;
  matchType: string;
  productId: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
  };
  placementTypes: string; // JSON
  maxLinksPerArticle: number;
  categoryFilter: string;
  isActive: boolean;
  priority: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

const AVAILABLE_PLACEMENTS = [
  { id: 'CONTEXT_LINK', label: 'Contextual In-Text Link', desc: 'Auto-links keywords within recipe text' },
  { id: 'INLINE_CARD', label: 'Inline Recipe Card', desc: 'Featured card between ingredient & step sections' },
  { id: 'SIDEBAR', label: 'Sidebar Recommendation', desc: 'Sticky sidebar visual banner on desktop' },
  { id: 'BANNER', label: 'Article Banner', desc: 'Highlight banner after recipe introduction' },
  { id: 'END_CTA', label: 'End-of-Recipe CTA', desc: 'Bottom call-to-action to buy verified ingredients' },
];

export default function RulesManager({
  initialRules,
  products,
  categories,
}: {
  initialRules: PromotionRuleItem[];
  products: ProductSummary[];
  categories: CategorySummary[];
}) {
  const [rules, setRules] = useState<PromotionRuleItem[]>(initialRules);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [productFilter, setProductFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PromotionRuleItem | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formMatchType, setFormMatchType] = useState('CONTAINS');
  const [formProductId, setFormProductId] = useState('');
  const [formPlacements, setFormPlacements] = useState<string[]>([
    'CONTEXT_LINK',
    'INLINE_CARD',
  ]);
  const [formMaxLinks, setFormMaxLinks] = useState(2);
  const [formCategoryFilter, setFormCategoryFilter] = useState('ALL');
  const [formPriority, setFormPriority] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Keyword tag helper
  const [keywordInput, setKeywordInput] = useState('');

  // Open "Create New Rule" Modal
  const openCreateModal = () => {
    setFormName('');
    setFormKeywords('');
    setFormMatchType('CONTAINS');
    setFormProductId(products[0]?.id || '');
    setFormPlacements(['CONTEXT_LINK', 'INLINE_CARD']);
    setFormMaxLinks(2);
    setFormCategoryFilter('ALL');
    setFormPriority(1);
    setFormIsActive(true);
    setKeywordInput('');
    setSubmitError('');
    setSubmitSuccess('');
    setIsCreateOpen(true);
  };

  // Open "Edit Rule" Modal
  const openEditModal = (rule: PromotionRuleItem) => {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormKeywords(rule.keywords);
    setFormMatchType(rule.matchType || 'CONTAINS');
    setFormProductId(rule.productId);

    try {
      setFormPlacements(JSON.parse(rule.placementTypes || '["CONTEXT_LINK","INLINE_CARD"]'));
    } catch {
      setFormPlacements(['CONTEXT_LINK', 'INLINE_CARD']);
    }

    setFormMaxLinks(rule.maxLinksPerArticle || 2);
    setFormCategoryFilter(rule.categoryFilter || 'ALL');
    setFormPriority(rule.priority || 1);
    setFormIsActive(Boolean(rule.isActive));
    setKeywordInput('');
    setSubmitError('');
    setSubmitSuccess('');
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingRule(null);
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Placement toggle
  const togglePlacement = (id: string) => {
    setFormPlacements((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Add keyword from input
  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = formKeywords
      ? formKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];
    if (!current.includes(keywordInput.trim().toLowerCase())) {
      const updated = [...current, keywordInput.trim().toLowerCase()].join(', ');
      setFormKeywords(updated);
    }
    setKeywordInput('');
  };

  // Remove keyword
  const removeKeyword = (kwToRemove: string) => {
    const current = formKeywords
      ? formKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];
    const updated = current.filter((k) => k !== kwToRemove).join(', ');
    setFormKeywords(updated);
  };

  // Quick toggle active directly from card
  const handleToggleActive = async (rule: PromotionRuleItem) => {
    const newStatus = !rule.isActive;
    // Optimistic update
    setRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, isActive: newStatus } : r))
    );

    try {
      const res = await fetch(`/api/admin/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        // Rollback
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, isActive: !newStatus } : r))
        );
      }
    } catch {
      // Rollback
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, isActive: !newStatus } : r))
      );
    }
  };

  // Handle Create Rule Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProductId) {
      setSubmitError('Please select a target product for this rule.');
      return;
    }
    if (!formKeywords.trim()) {
      setSubmitError('Please enter at least one trigger keyword.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          keywords: formKeywords,
          matchType: formMatchType,
          productId: formProductId,
          placementTypes: JSON.stringify(formPlacements),
          maxLinksPerArticle: Number(formMaxLinks),
          categoryFilter: formCategoryFilter,
          priority: Number(formPriority),
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create rule');
      } else {
        const prod = products.find((p) => p.id === formProductId);
        const createdRule: PromotionRuleItem = {
          ...data.rule,
          product: prod || { id: formProductId, name: 'Product', imageUrl: '', slug: '' },
        };
        setRules((prev) => [createdRule, ...prev]);
        setSubmitSuccess('Contextual rule created successfully!');
        setTimeout(() => {
          closeModals();
        }, 700);
      }
    } catch {
      setSubmitError('Network error creating rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Rule Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    if (!formProductId) {
      setSubmitError('Please select a target product.');
      return;
    }
    if (!formKeywords.trim()) {
      setSubmitError('Please enter at least one trigger keyword.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`/api/admin/rules/${editingRule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          keywords: formKeywords,
          matchType: formMatchType,
          productId: formProductId,
          placementTypes: JSON.stringify(formPlacements),
          maxLinksPerArticle: Number(formMaxLinks),
          categoryFilter: formCategoryFilter,
          priority: Number(formPriority),
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to update rule');
      } else {
        const prod = products.find((p) => p.id === formProductId);
        setRules((prev) =>
          prev.map((r) =>
            r.id === editingRule.id
              ? {
                  ...r,
                  ...data.rule,
                  product: prod || r.product,
                }
              : r
          )
        );
        setSubmitSuccess('Rule updated successfully!');
        setTimeout(() => {
          closeModals();
        }, 700);
      }
    } catch {
      setSubmitError('Network error updating rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Rule
  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contextual promotion rule?')) {
      return;
    }

    setDeletingRuleId(id);
    try {
      const res = await fetch(`/api/admin/rules/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRules((prev) => prev.filter((r) => r.id !== id));
        if (editingRule?.id === id) {
          closeModals();
        }
      } else {
        alert('Failed to delete rule.');
      }
    } catch {
      alert('Network error deleting rule.');
    } finally {
      setDeletingRuleId(null);
    }
  };

  // Filter rules
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? r.isActive
        : !r.isActive;

    const matchesProduct =
      productFilter === 'ALL' ? true : r.productId === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules, keywords, or products..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-stone-800 text-gold-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({rules.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'ACTIVE'
                  ? 'bg-stone-800 text-emerald-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'INACTIVE'
                  ? 'bg-stone-800 text-stone-300 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Inactive
            </button>
          </div>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create Rule Button */}
        <button
          type="button"
          onClick={openCreateModal}
          className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Contextual Rule
        </button>
      </div>

      {/* Rules Grid */}
      {filteredRules.length === 0 ? (
        <div className="text-center py-20 bg-stone-950/60 border border-stone-800 rounded-3xl p-8 space-y-3">
          <Sparkles className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg text-stone-200">No contextual rules found</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            {searchQuery
              ? `No rules matched "${searchQuery}".`
              : 'Add rules to automatically connect recipe keywords with A.S. Brand products.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Rule Now
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredRules.map((rule) => {
            let placements: string[] = [];
            try {
              placements = JSON.parse(rule.placementTypes || '[]');
            } catch {
              placements = [];
            }

            const keywordsList = rule.keywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean);

            return (
              <div
                key={rule.id}
                className={`bg-stone-950/70 border rounded-3xl p-6 space-y-4 transition-all shadow-lg flex flex-col justify-between ${
                  rule.isActive
                    ? 'border-stone-800 hover:border-gold-500/50'
                    : 'border-stone-900 opacity-70 bg-stone-950/40'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Priority, Status Toggle & Action Buttons */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gold-500/30">
                          Priority {rule.priority}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Max {rule.maxLinksPerArticle} Links / Article
                        </span>
                        <span className="text-[10px] text-stone-500 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          Match: {rule.matchType || 'CONTAINS'}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-stone-100 mt-1.5">
                        {rule.name}
                      </h3>
                    </div>

                    {/* Active Status Button / Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(rule)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 ${
                        rule.isActive
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60 hover:bg-emerald-900/60'
                          : 'text-stone-400 bg-stone-900 border-stone-800 hover:bg-stone-800'
                      }`}
                      title={rule.isActive ? 'Click to deactivate rule' : 'Click to activate rule'}
                    >
                      {rule.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Target Product Display */}
                  <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white rounded-lg p-1 shrink-0 overflow-hidden">
                        <img
                          src={rule.product?.imageUrl || '/recipes/crispy-spicy-fish-fry-recipe.jpg'}
                          alt={rule.product?.name || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">
                          Target Product
                        </div>
                        <div className="text-xs font-bold text-stone-200 line-clamp-1">
                          {rule.product?.name}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-stone-500 font-mono shrink-0">
                      Category: {rule.categoryFilter || 'ALL'}
                    </span>
                  </div>

                  {/* Trigger Keywords Display */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gold-400" /> Topic & Keyword Triggers ({keywordsList.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {keywordsList.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs bg-stone-900 text-stone-300 px-2.5 py-1 rounded-lg border border-stone-800"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enabled Placements */}
                  <div className="pt-2">
                    <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1.5 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-stone-400" /> Enabled Placements:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {placements.map((p) => {
                        const info = AVAILABLE_PLACEMENTS.find((ap) => ap.id === p);
                        return (
                          <span
                            key={p}
                            className="text-[10px] font-semibold text-stone-300 bg-stone-900 px-2 py-0.5 rounded border border-stone-800"
                          >
                            {info ? info.label : p.replace(/_/g, ' ')}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Edit & Delete buttons */}
                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500">
                    Rule ID: {rule.id.slice(0, 8)}...
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(rule)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-gold-400 text-xs font-bold rounded-xl border border-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Rule
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      disabled={deletingRuleId === rule.id}
                      className="p-1.5 bg-stone-900 hover:bg-red-950/80 text-stone-400 hover:text-red-300 rounded-xl border border-stone-800 hover:border-red-800 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE OR EDIT CONTEXTUAL RULE                          */}
      {/* ============================================================== */}
      {(isCreateOpen || editingRule) && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    {isCreateOpen ? 'Create Contextual Promotion Rule' : 'Edit Contextual Promotion Rule'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Configure keywords, matching type, target product, and display placements
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
              onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit}
              className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1 text-xs"
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

              {/* 1. Rule Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Rule Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Compounded Hing in Sambar & Dal Recipes"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-medium"
                />
              </div>

              {/* 2. Target Product Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1">
                  <Store className="w-3 h-3 text-gold-400" />
                  <span>Target A.S. Brand Product *</span>
                </label>
                <select
                  required
                  value={formProductId}
                  onChange={(e) => setFormProductId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="">-- Choose Product to Promote --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Keywords / Trigger Phrases */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gold-400" />
                  <span>Keywords & Trigger Phrases (Comma Separated) *</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="Type keyword and press Enter or click Add (e.g. asafoetida, hing, sambar, dal, tadka)"
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-gold-400 font-bold rounded-xl border border-stone-700 transition-colors cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>

                {/* Direct text editor fallback */}
                <input
                  type="text"
                  required
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  placeholder="sesame oil, gingelly oil, dosa oil, idli oil"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-400 focus:outline-none focus:border-gold-500 font-mono"
                />

                {/* Badges preview */}
                {formKeywords && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formKeywords
                      .split(',')
                      .map((k) => k.trim())
                      .filter(Boolean)
                      .map((kw) => (
                        <span
                          key={kw}
                          className="bg-stone-800 text-stone-200 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1"
                        >
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(kw)}
                            className="hover:text-red-400 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* 4. Match Type, Category Filter & Max Links */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Match Type
                  </label>
                  <select
                    value={formMatchType}
                    onChange={(e) => setFormMatchType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="CONTAINS">Contains (Flexible)</option>
                    <option value="EXACT">Exact Word</option>
                    <option value="PHRASE">Phrase Sequence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Category Filter
                  </label>
                  <select
                    value={formCategoryFilter}
                    onChange={(e) => setFormCategoryFilter(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Max Links / Article
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formMaxLinks}
                    onChange={(e) => setFormMaxLinks(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-gold-500 text-center"
                  />
                </div>
              </div>

              {/* 5. Placements Options (Interactive Checkboxes / Badges) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-gold-400" />
                  <span>Enabled Placements (Where recommendation will render)</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {AVAILABLE_PLACEMENTS.map((p) => {
                    const isChecked = formPlacements.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePlacement(p.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-forest-950/70 border-forest-700/80 text-emerald-200'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="mt-0.5 accent-gold-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-stone-200">{p.label}</div>
                          <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                            {p.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Priority & Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-200 block">
                      Rule Active Status
                    </span>
                    <span className="text-[10px] text-stone-500">
                      When active, automatic matching runs across all live recipe articles
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 uppercase font-semibold">
                    Priority (1-10):
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formPriority}
                    onChange={(e) => setFormPriority(Number(e.target.value))}
                    className="w-16 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-100 text-center focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                {editingRule ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(editingRule.id)}
                    disabled={deletingRuleId === editingRule.id}
                    className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold rounded-xl border border-red-800 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Rule</span>
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
                        {isCreateOpen ? 'Create & Activate Rule' : 'Save Rule Changes'}
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
