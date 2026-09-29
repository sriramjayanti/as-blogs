'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Loader2,
  ArrowLeft,
  ArrowUpRight,
  ImageIcon,
  RefreshCw,
  Search,
  Globe,
  Layers,
  BookOpen,
} from 'lucide-react';

const COMMON_IMAGE_PRESETS = [
  { name: 'Fish Fry', url: '/recipes/crispy-spicy-fish-fry-recipe.jpg' },
  { name: 'Veg Kurma', url: '/recipes/restaurant-style-vegetable-kurma-recipe.jpg' },
  { name: 'Paneer Kurma', url: '/recipes/rich-creamy-paneer-kurma-recipe.jpg' },
  { name: 'Coconut Halwa', url: '/recipes/traditional-coconut-halwa-sweet-recipe.jpg' },
  { name: 'Chicken 65', url: '/recipes/crispy-restaurant-style-chicken-65-recipe.jpg' },
  { name: 'Toor Dhal Idli', url: '/recipes/protein-rich-toor-dhal-idli-recipe.jpg' },
  { name: 'Potato Fry', url: '/recipes/crispy-potato-fry-aloo-roast-recipe.jpg' },
  { name: 'Potato Bonda', url: '/recipes/crispy-golden-potato-bonda-festival-snack-recipe.jpg' },
  { name: 'Masala Dosa', url: '/recipes/crispy-plain-sada-dosa-recipe.jpg' },
  { name: 'Carrot Halwa', url: '/recipes/rich-gajar-ka-halwa-carrot-sweet-recipe.jpg' },
];

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [titleTe, setTitleTe] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptTe, setExcerptTe] = useState('');
  const [content, setContent] = useState('');
  const [contentTe, setContentTe] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);

  // Categories
  const [categories, setCategories] = useState<any[]>([]);

  // Load article & categories on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [articleRes, articlesListRes] = await Promise.all([
          fetch(`/api/admin/articles/${params.id}`),
          fetch('/api/admin/articles'),
        ]);

        const articleData = await articleRes.json();
        const listData = await articlesListRes.json();

        if (listData.articles && listData.articles.length > 0) {
          const cats = Array.from(
            new Map<string, any>(
              listData.articles.map((a: any) => [a.category.id, a.category])
            ).values()
          );
          setCategories(cats);
        }

        if (articleData.article) {
          const a = articleData.article;
          setTitle(a.title || '');
          setTitleTe(a.titleTe || '');
          setSlug(a.slug || '');
          setExcerpt(a.excerpt || '');
          setExcerptTe(a.excerptTe || '');
          setContent(a.content || '');
          setContentTe(a.contentTe || '');
          setFeaturedImage(a.featuredImage || '');
          setImageAlt(a.imageAlt || '');
          setCategoryId(a.categoryId || '');
          setCategorySlug(a.category?.slug || '');
          setFocusKeyword(a.focusKeyword || '');
          setSeoTitle(a.seoTitle || a.title || '');
          setMetaDescription(a.metaDescription || a.excerpt || '');
          setIsSponsored(Boolean(a.isSponsored));
        } else {
          setError(articleData.error || 'Failed to load article');
        }
      } catch (err) {
        setError('Error loading article data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  // Live SEO Calculations
  const titleLength = seoTitle ? seoTitle.length : title.length;
  const metaDescLength = metaDescription ? metaDescription.length : 0;
  const hasH2 = /<h2\b|##\s+/i.test(content);
  const hasKeywordInTitle = focusKeyword
    ? (seoTitle || title).toLowerCase().includes(focusKeyword.toLowerCase())
    : false;
  const hasKeywordInContent = focusKeyword
    ? content.toLowerCase().includes(focusKeyword.toLowerCase())
    : false;
  const hasImageAlt = Boolean(imageAlt.trim());

  let seoScore = 0;
  if (titleLength >= 35 && titleLength <= 65) seoScore += 20;
  else if (titleLength > 0) seoScore += 10;
  if (metaDescLength >= 120 && metaDescLength <= 160) seoScore += 25;
  else if (metaDescLength > 0) seoScore += 15;
  if (hasH2) seoScore += 20;
  if (hasKeywordInTitle) seoScore += 15;
  if (hasKeywordInContent) seoScore += 10;
  if (hasImageAlt) seoScore += 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          titleTe: titleTe || null,
          slug,
          excerpt,
          excerptTe: excerptTe || null,
          content,
          contentTe: contentTe || null,
          featuredImage,
          imageAlt,
          categoryId,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt,
          focusKeyword,
          isSponsored,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update article');
      } else {
        setSuccessMsg('Article and photo updated successfully!');
        if (data.article?.category?.slug) {
          setCategorySlug(data.article.category.slug);
        }
      }
    } catch (err) {
      setError('An error occurred during save.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
          <span>Loading article editor...</span>
        </div>
      </div>
    );
  }

  const liveArticleUrl = categorySlug && slug ? `/${categorySlug}/${slug}` : '#';

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/articles"
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
            </Link>
            <span className="text-stone-600">•</span>
            <span className="text-xs text-forest-400 font-mono">ID: {params.id.slice(0, 8)}...</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Edit Article & Recipe Photo
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Update recipe images, bilingual text, cooking steps, and SEO metadata.
          </p>
        </div>

        {liveArticleUrl !== '#' && (
          <a
            href={liveArticleUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-gold-400 font-semibold text-xs rounded-xl border border-stone-800 transition-colors shrink-0 shadow-sm"
          >
            View Live Article <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-xs text-emerald-200 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          {liveArticleUrl !== '#' && (
            <a
              href={liveArticleUrl}
              target="_blank"
              className="font-bold underline hover:text-white"
            >
              Preview Live
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 pb-20 lg:pb-0">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Featured Image & Visual Asset Card (Prominent & Easy to Edit) */}
          <div className="bg-stone-950/80 border-2 border-forest-800/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Featured Photo & Visual Asset
                </h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                Recipe Hero Image
              </span>
            </div>

            {/* Live Visual Preview */}
            <div className="grid sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
                  Live Photo Preview
                </label>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900 border-2 border-stone-800 shadow-md">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={imageAlt || title || 'Recipe image'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 text-xs">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>No photo URL specified</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 mt-2 font-mono truncate">
                  Current: {featuredImage || 'None'}
                </p>
              </div>

              <div className="sm:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Image URL (Local Path or Unsplash/CDN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="e.g. /recipes/crispy-spicy-fish-fry-recipe.jpg"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Image Alt Description (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="e.g. Crispy spicy fish fry served on banana leaf"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <span className="block text-[11px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider">
                    Quick Local Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {COMMON_IMAGE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setFeaturedImage(p.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                          featuredImage === p.url
                            ? 'bg-gold-500 text-stone-950 font-bold border-gold-400'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Article Text & Details */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Title (English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-base text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Title (Telugu - తెలుగు)
              </label>
              <input
                type="text"
                value={titleTe}
                onChange={(e) => setTitleTe(e.target.value)}
                placeholder="తెలుగు రెసిపీ శీర్షిక..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const selected = categories.find((c) => c.id === e.target.value);
                    if (selected) setCategorySlug(selected.slug);
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Excerpt (Summary for Cards & Meta Description)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Body Content (English HTML) *
              </label>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Telugu Body Content (తెలుగు పాఠం)
              </label>
              <textarea
                rows={8}
                value={contentTe}
                onChange={(e) => setContentTe(e.target.value)}
                placeholder="తెలుగు వివరణ లేదా వంట విధానం..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes & Update Photo
                </>
              )}
            </button>

            <Link
              href="/admin/articles"
              className="px-6 py-4 bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold text-xs uppercase tracking-wider rounded-2xl border border-stone-800 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Sidebar Column: Live SEO Auditor & Meta Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live SEO Auditor */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif text-sm font-bold text-stone-100">
                  Live SEO Auditor
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  seoScore >= 70
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : seoScore >= 40
                    ? 'bg-gold-950 text-gold-400 border border-gold-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                Score: {seoScore}/100
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Title Length (35-65 chars)</span>
                <span
                  className={
                    titleLength >= 35 && titleLength <= 65
                      ? 'text-emerald-400 font-semibold'
                      : 'text-stone-500'
                  }
                >
                  {titleLength} chars
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400">Meta Desc (120-160 chars)</span>
                <span
                  className={
                    metaDescLength >= 120 && metaDescLength <= 160
                      ? 'text-emerald-400 font-semibold'
                      : 'text-stone-500'
                  }
                >
                  {metaDescLength} chars
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400">Subheadings (&lt;h2&gt;)</span>
                <span className={hasH2 ? 'text-emerald-400 font-semibold' : 'text-stone-500'}>
                  {hasH2 ? 'Included' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400">Image Alt Text</span>
                <span
                  className={hasImageAlt ? 'text-emerald-400 font-semibold' : 'text-stone-500'}
                >
                  {hasImageAlt ? 'Configured' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-100 pb-2 border-b border-stone-800">
              Search Engine Settings
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. fish fry recipe"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-400 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
