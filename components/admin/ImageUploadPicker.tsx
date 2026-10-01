'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  ImageIcon,
  FolderOpen,
  Link as LinkIcon,
  Check,
  Loader2,
  X,
  Search,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
}

export default function ImageUploadPicker({
  value,
  onChange,
  altValue = '',
  onAltChange,
  label = 'Featured Photo & Visual Asset',
}: ImageUploadPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery when opened
  const loadGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (data.images) {
        setGalleryImages(data.images);
      }
    } catch {
      // ignore
    } finally {
      setGalleryLoading(false);
    }
  };

  const openGallery = () => {
    setShowGallery(true);
    loadGallery();
  };

  // Upload handler
  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Failed to upload photo');
      } else if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      setUploadError('Network error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const filteredImages = galleryImages.filter((img) =>
    img.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-stone-950/80 border-2 border-forest-800/60 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-lg font-bold text-stone-100">{label}</h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/70">
          Photo Change Ready
        </span>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid: Preview Card on Left, Upload/Pick Actions on Right */}
      <div className="grid sm:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Preview Drop Zone */}
        <div className="sm:col-span-6 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
            Current Photo Preview
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all shadow-md flex items-center justify-center ${
              isDragging
                ? 'border-gold-400 bg-gold-950/40 ring-4 ring-gold-500/20'
                : 'border-stone-800 bg-stone-900'
            }`}
          >
            {value ? (
              <Image
                src={value}
                alt={altValue || 'Current photo'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-500 text-xs p-4 text-center">
                <ImageIcon className="w-10 h-10 mb-2 text-stone-600" />
                <span>Drag & drop photo here or choose upload</span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-gold-400 gap-2 z-10">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">Uploading Photo...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
            <span className="truncate max-w-[240px]">{value || 'No photo selected'}</span>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer shrink-0 ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Upload Actions & Preset Picker */}
        <div className="sm:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
              Photo Change Options
            </label>

            {/* Primary Action Buttons: Upload & Browse Gallery */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Upload From Computer */}
              <label className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-forest-900/90 hover:bg-forest-800 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-forest-700/80 transition-all cursor-pointer shadow-md hover:shadow-lg">
                <Upload className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Upload Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {/* 2. Browse Gallery */}
              <button
                type="button"
                onClick={openGallery}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-gold-400 font-bold text-xs uppercase tracking-wider border border-stone-800 transition-all cursor-pointer shadow-md"
              >
                <FolderOpen className="w-4 h-4 shrink-0 text-gold-400" />
                <span>Browse Gallery</span>
              </button>
            </div>
          </div>

          {/* Direct URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Or Direct Photo URL / CDN</span>
            </label>
            <input
              type="text"
              required
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. /recipes/crispy-spicy-fish-fry-recipe.jpg"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500 font-mono shadow-inner"
            />
          </div>

          {/* Image Alt Description */}
          {onAltChange && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Image Alt Description (SEO & Accessibility)
              </label>
              <input
                type="text"
                value={altValue}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="e.g. Crispy spicy fish fry served on banana leaf"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Select Photo from Library ({galleryImages.length} images)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-stone-800 bg-stone-950/50 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos by dish name (e.g. fish, chicken, kurma, halwa)..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="button"
                onClick={loadGallery}
                className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition-colors"
                title="Refresh gallery"
              >
                <RefreshCw className={`w-4 h-4 ${galleryLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Modal Image Grid */}
            <div className="p-5 overflow-y-auto flex-1">
              {galleryLoading ? (
                <div className="flex items-center justify-center py-20 text-stone-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-gold-500 mr-2" />
                  Loading library photos...
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 text-stone-500 text-xs">
                  No images matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredImages.map((img) => {
                    const isSelected = value === img.url;
                    return (
                      <div
                        key={img.fileName}
                        onClick={() => {
                          onChange(img.url);
                          setShowGallery(false);
                        }}
                        className={`group relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gold-500 ring-4 ring-gold-500/20'
                            : 'border-stone-800 hover:border-gold-400/80 hover:scale-[1.02]'
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.fileName}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] text-stone-200 font-mono truncate">
                            {img.fileName}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 text-stone-950 flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-800 bg-stone-950/50 flex items-center justify-between text-xs text-stone-400">
              <span>Click any image to select it for your article</span>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
