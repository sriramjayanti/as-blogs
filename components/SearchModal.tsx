'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: { name: string; slug: string };
  readingTime: number;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.articles || []);
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-cream-50 rounded-2xl max-w-2xl w-full shadow-2xl border border-cream-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-forest-800 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, recipe, ingredient (e.g. groundnut, sesame, pooja)..."
            className="w-full bg-transparent outline-none text-stone-800 placeholder-stone-400 text-base"
          />
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gold-600 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="text-xs bg-cream-200 hover:bg-cream-300 text-stone-700 px-2.5 py-1 rounded font-medium ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {results.length > 0 ? (
            results.map((item) => (
              <Link
                key={item.id}
                href={`/${item.category.slug}/${item.slug}`}
                onClick={onClose}
                className="group block p-3.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-cream-200 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-forest-700 mb-1">
                  <span>{item.category.name}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-normal">{item.readingTime} min read</span>
                </div>
                <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-forest-800 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {item.excerpt}
                </p>
              </Link>
            ))
          ) : query ? (
            <div className="py-12 text-center text-stone-500">
              <BookOpen className="w-10 h-10 mx-auto text-stone-400 mb-2 opacity-60" />
              <p className="font-medium text-sm">No editorial articles found matching "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for keywords like "sesame", "smoke point", "deepam", or "frying".
              </p>
            </div>
          ) : (
            <div className="py-6 px-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
                Suggested Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gingelly Oil Smoke Points',
                  'Pancha Thailam Deepam',
                  'Groundnut Oil Frying',
                  'Idli Milagai Podi Recipe',
                  'Cold Pressed Health',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs bg-cream-100 hover:bg-forest-900 hover:text-white text-stone-700 px-3 py-1.5 rounded-lg border border-cream-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
