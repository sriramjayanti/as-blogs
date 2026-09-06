'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Loader2,
  Search,
  Globe,
} from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80'
  );
  const [imageAlt, setImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsoredBrand, setSponsoredBrand] = useState('A.S. Brand Oils');

  // Categories & Authors for dropdowns
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    // Auto-generate slug and defaults from title
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
    if (title && !seoTitle) {
      setSeoTitle(title);
    }
  }, [title]);

  useEffect(() => {
    if (excerpt && !metaDescription) {
      setMetaDescription(excerpt);
    }
  }, [excerpt]);

  // Load categories and authors on mount
  useEffect(() => {
    fetch('/api/admin/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          const cats = Array.from(
            new Map<string, any>(data.articles.map((a: any) => [a.category.id, a.category])).values()
          );
          const auths = Array.from(
            new Map<string, any>(data.articles.map((a: any) => [a.author.id, a.author])).values()
          );
          setCategories(cats);
          setAuthors(auths);
          if (cats.length > 0 && cats[0]) setCategoryId((cats[0] as any).id);
          if (auths.length > 0 && auths[0]) setAuthorId((auths[0] as any).id);
        }
      })
      .catch(() => {});
  }, []);

  // Live SEO Auditor Calculations
  const titleLength = seoTitle ? seoTitle.length : title.length;
  const metaDescLength = metaDescription.length;
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
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          imageAlt,
          categoryId,
          authorId,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt,
          focusKeyword,
          isSponsored,
          sponsoredBrand,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to publish article');
      } else {
        router.push('/admin/articles');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during publication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-100">
            Publish New SEO Article
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Author authoritative editorial content with real-time SEO scoring and automated promotional linking.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Title (H1) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Science of Sesame: Why Hulled Gingelly Oil Elevates Sambar"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-base text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 font-serif"
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
                  placeholder="science-of-hulled-gingelly-oil"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Focus Topic / Keyword
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. hulled gingelly oil"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-400 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Author *
                </label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.roleTitle})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Excerpt (Summary for Grids & Social Cards)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief 1-2 sentence compelling summary of the article..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Article Body (HTML/Text) *
              </label>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Write your detailed editorial story here with headings (<h2>) and rich paragraphs...</p>"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs font-mono text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Image Alt Text (for SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Traditional cold-pressed oil in brass vessel"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm uppercase tracking-wider py-4 rounded-2xl transition-colors shadow-lg hover:shadow-gold-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Publish Article to Magazine
              </>
            )}
          </button>
        </div>

        {/* Live SEO Auditor & Previews Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* SEO Score Box */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" /> Live SEO Auditor
              </h3>
              <span
                className={`font-bold font-mono text-sm px-2.5 py-0.5 rounded-full ${
                  seoScore >= 80
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : seoScore >= 50
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {seoScore} / 100
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-300">SEO Title Length ({titleLength} chars)</span>
                {titleLength >= 35 && titleLength <= 65 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-300">Meta Desc ({metaDescLength} chars)</span>
                {metaDescLength >= 120 && metaDescLength <= 160 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-300">Structured H2 Subheadings</span>
                {hasH2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-stone-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-300">Keyword in Title</span>
                {hasKeywordInTitle ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-stone-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-300">Image Alt Attribute</span>
                {hasImageAlt ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-stone-500" />
                )}
              </div>
            </div>
          </div>

          {/* Google SERP Search Snippet Preview */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-cyan-400" /> Google Search Preview
            </div>

            <div className="bg-white rounded-xl p-4 text-left shadow-sm space-y-1">
              <div className="text-[11px] text-stone-600 truncate flex items-center gap-1">
                <Globe className="w-3 h-3 text-stone-400" />
                https://asbrandoils.com &gt; blog &gt; {slug || 'article-slug'}
              </div>
              <div className="text-sm font-medium text-blue-800 hover:underline line-clamp-1">
                {seoTitle || title || 'Article Title - A.S. Heritage & Living'}
              </div>
              <div className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || 'Meta description snippet will appear in Google search results...'}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
