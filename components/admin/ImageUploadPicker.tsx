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
  Zap,
  CheckCircle2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Sparkles,
  Layers,
  Crop,
  CheckCheck,
} from 'lucide-react';

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
  initialValue?: string;
  onQuickSave?: (url: string) => Promise<void> | void;
  isQuickSaving?: boolean;
  quickSaveSuccess?: boolean;
}

export default function ImageUploadPicker({
  value,
  onChange,
  altValue = '',
  onAltChange,
  label = 'Featured Photo & Visual Asset',
  initialValue,
  onQuickSave,
  isQuickSaving = false,
  quickSaveSuccess = false,
}: ImageUploadPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [justUploadedUrl, setJustUploadedUrl] = useState<string | null>(null);

  // Photo Studio & Adjustments State
  const [showStudio, setShowStudio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16/9' | '4/3' | '1/1' | '21/9'>('16/9');
  const [frameStyle, setFrameStyle] = useState<'none' | 'gold' | 'polaroid' | 'vignette' | 'glass'>('none');
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 100% to 180%
  const [focusAlign, setFocusAlign] = useState<'center' | 'top' | 'bottom'>('center');
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [filterPreset, setFilterPreset] = useState<'normal' | 'vibrant' | 'warm' | 'crisp'>('normal');
  const [isBakingAdjustments, setIsBakingAdjustments] = useState(false);
  const [bakeSuccess, setBakeSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

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

  // Client-side image compression: resizes large photos to optimal 1200px WebP (< 150KB)
  const compressImageClientSide = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (file.type === 'image/svg+xml' || file.size < 100 * 1024) {
        return resolve(file);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let { width, height } = img;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '') + '.webp',
                { type: 'image/webp' }
              );
              resolve(compressedFile);
            },
            'image/webp',
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Core Upload handler
  const handleFile = async (file: File, isFromModal = false) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const processedFile = await compressImageClientSide(file);
      const formData = new FormData();
      formData.append('file', processedFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setUploadError('Your admin session has expired. Please refresh or re-login at /admin/login.');
        } else {
          setUploadError(data.error || 'Failed to upload photo. Please try another image format.');
        }
      } else if (data.url) {
        onChange(data.url);
        setJustUploadedUrl(data.url);

        // If uploaded inside gallery modal, refresh library to show new image at top
        if (isFromModal || showGallery) {
          await loadGallery();
        }
      }
    } catch {
      setUploadError('Network error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (modalFileInputRef.current) modalFileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Bake Studio Adjustments into a Permanent Image via Canvas
  const applyStudioBaking = async () => {
    if (!value) return;
    setIsBakingAdjustments(true);

    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = value;
      });

      // Target canvas dimensions based on chosen aspect ratio
      let targetW = 1200;
      let targetH = 675; // 16:9
      if (aspectRatio === '4/3') targetH = 900;
      else if (aspectRatio === '1/1') targetH = 1200;
      else if (aspectRatio === '21/9') targetH = 514;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply filter to context
      if (filterPreset === 'vibrant') {
        ctx.filter = 'contrast(1.15) saturate(1.35) brightness(1.02)';
      } else if (filterPreset === 'warm') {
        ctx.filter = 'sepia(0.18) saturate(1.25) contrast(1.08) brightness(1.02)';
      } else if (filterPreset === 'crisp') {
        ctx.filter = 'contrast(1.2) brightness(1.04)';
      } else {
        ctx.filter = 'none';
      }

      ctx.save();
      ctx.translate(targetW / 2, targetH / 2);

      // Rotate
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      // Flip
      if (isFlippedH) {
        ctx.scale(-1, 1);
      }

      // Zoom
      const scale = zoomLevel / 100;
      ctx.scale(scale, scale);

      // Draw fitted image
      const imgAspect = img.width / img.height;
      const targetAspect = targetW / targetH;
      let drawW, drawH;

      if (imgAspect > targetAspect) {
        drawH = targetH;
        drawW = targetH * imgAspect;
      } else {
        drawW = targetW;
        drawH = targetW / imgAspect;
      }

      let drawX = -drawW / 2;
      let drawY = -drawH / 2;

      // Focus position shift
      if (focusAlign === 'top') {
        drawY = -drawH / 2 + (drawH - targetH) * 0.25;
      } else if (focusAlign === 'bottom') {
        drawY = -drawH / 2 - (drawH - targetH) * 0.25;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Export canvas to WebP file and upload
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/webp', 0.88)
      );

      if (blob) {
        const file = new File([blob], `recipe-styled-${Date.now()}.webp`, {
          type: 'image/webp',
        });
        await handleFile(file);
        setBakeSuccess(true);
        setTimeout(() => setBakeSuccess(false), 4000);

        // Reset manual transforms because they are now baked permanently
        setZoomLevel(100);
        setRotation(0);
        setIsFlippedH(false);
        setFilterPreset('normal');
      }
    } catch (err) {
      console.warn('Could not bake image adjustments:', err);
    } finally {
      setIsBakingAdjustments(false);
    }
  };

  const filteredImages = galleryImages.filter((img) =>
    (img.fileName || img.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isChanged = Boolean(initialValue && value && value !== initialValue);

  // CSS Filter string for real-time live preview
  let previewFilterStyle = 'none';
  if (filterPreset === 'vibrant') previewFilterStyle = 'contrast(1.15) saturate(1.35) brightness(1.02)';
  else if (filterPreset === 'warm') previewFilterStyle = 'sepia(0.18) saturate(1.25) contrast(1.08) brightness(1.02)';
  else if (filterPreset === 'crisp') previewFilterStyle = 'contrast(1.2) brightness(1.04)';

  // CSS Aspect ratio class
  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : 'aspect-video'; // 16/9 default

  // CSS Frame styling wrapper
  let frameWrapperClass = 'border-2 border-stone-800 bg-stone-900 rounded-2xl';
  if (frameStyle === 'gold') {
    frameWrapperClass =
      'p-2.5 bg-gradient-to-br from-amber-600 via-gold-400 to-amber-700 rounded-3xl shadow-2xl border-2 border-gold-300 ring-4 ring-gold-500/20';
  } else if (frameStyle === 'polaroid') {
    frameWrapperClass =
      'p-3 pb-8 bg-white rounded-2xl shadow-2xl border border-stone-200 text-stone-900';
  } else if (frameStyle === 'glass') {
    frameWrapperClass =
      'p-2.5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl ring-2 ring-white/10';
  }

  return (
    <div className="bg-stone-950/80 border-2 border-forest-800/60 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-lg font-bold text-stone-100">{label}</h3>
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => setShowStudio(!showStudio)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showStudio
                  ? 'bg-gold-500 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900 text-gold-400 border border-gold-500/30 hover:border-gold-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio & Adjustments</span>
            </button>
          )}

          {isChanged ? (
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-600/70 animate-pulse font-semibold">
              ● Photo Changed (Click Save)
            </span>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/70">
              Photo Change Ready
            </span>
          )}
        </div>
      </div>

      {isChanged && (
        <div className="p-3 bg-amber-950/60 border border-amber-600/60 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Photo updated!</strong> Click <em>&quot;Save & Publish Photo Immediately&quot;</em> below or <em>&quot;Save Changes&quot;</em> to update the live website.
            </span>
          </div>
          {onQuickSave && value && (
            <button
              type="button"
              disabled={isQuickSaving}
              onClick={() => onQuickSave(value)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 shadow"
            >
              {isQuickSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" /> Save Now
                </>
              )}
            </button>
          )}
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid: Preview Card on Left, Upload/Pick Actions on Right */}
      <div className="grid sm:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Preview Drop Zone with Live Adjustments */}
        <div className="sm:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
              Current Photo Preview
            </label>
            {value && (
              <span className="text-[11px] text-stone-400 font-mono">
                {aspectRatio} • {frameStyle !== 'none' ? `${frameStyle} frame` : 'natural frame'}
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative transition-all ${frameWrapperClass} ${
              isDragging ? 'ring-4 ring-gold-500/40 border-gold-400' : ''
            }`}
          >
            <div className={`relative ${aspectClass} rounded-xl overflow-hidden flex items-center justify-center bg-stone-950`}>
              {value ? (
                <div
                  className="relative w-full h-full transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg) scaleX(${
                      isFlippedH ? -1 : 1
                    })`,
                    filter: previewFilterStyle,
                  }}
                >
                  <Image
                    src={value}
                    alt={altValue || 'Current recipe photo'}
                    fill
                    unoptimized
                    className={`object-cover transition-all ${
                      focusAlign === 'top'
                        ? 'object-top'
                        : focusAlign === 'bottom'
                        ? 'object-bottom'
                        : 'object-center'
                    }`}
                  />
                  {frameStyle === 'vignette' && (
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
                  )}
                </div>
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

            {frameStyle === 'polaroid' && value && (
              <div className="pt-3 text-center">
                <span className="font-serif italic text-xs text-stone-800 font-semibold truncate block px-2">
                  {altValue || 'A.S. Heritage Recipe Dish'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Clear & URL Display */}
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

          {/* Quick Publish Action */}
          {onQuickSave && value && (
            <button
              type="button"
              disabled={isQuickSaving || !value}
              onClick={() => onQuickSave(value)}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-500 hover:to-forest-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isQuickSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Saving & Publishing Photo...</span>
                </>
              ) : quickSaveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Photo Live on Website!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-gold-400 fill-current" />
                  <span>Save & Publish Photo Immediately</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right: Upload Actions & Direct Input */}
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
              placeholder="e.g. https://res.cloudinary.com/... or /recipes/fish-fry.jpg"
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
                placeholder="e.g. Crispy spicy paneer pakoda served with mint chutney"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* PHOTO STUDIO: Photo Frames, Sizes, Zoom, Rotation & Filters */}
      {value && showStudio && (
        <div className="pt-4 border-t border-stone-800 space-y-4 bg-stone-900/60 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <h4 className="font-serif text-sm font-bold text-stone-100">
                Photo Studio: Frames, Aspect Ratios & Enhancements
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowStudio(false)}
              className="text-stone-400 hover:text-white text-xs"
            >
              Close Studio
            </button>
          </div>

          {/* 1. Photo Sizes / Aspect Ratios */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2 flex items-center gap-1.5">
              <Crop className="w-3 h-3 text-gold-400" /> 1. Select Aspect Ratio / Size:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '16/9', label: '16:9 Hero', desc: 'Standard banner' },
                { id: '4/3', label: '4:3 Recipe', desc: 'Food photography' },
                { id: '1/1', label: '1:1 Square', desc: 'Social & cards' },
                { id: '21/9', label: '21:9 Pan', desc: 'Cinematic wide' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAspectRatio(item.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    aspectRatio === item.id
                      ? 'border-gold-500 bg-gold-950/40 text-gold-300 ring-2 ring-gold-500/20'
                      : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-stone-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo Frames */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-gold-400" /> 2. Decorative Photo Frames:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'Natural Clean', desc: 'Borderless' },
                { id: 'gold', label: 'Heritage Gold', desc: 'Royal double line' },
                { id: 'polaroid', label: 'Editorial Mount', desc: 'Classic white card' },
                { id: 'vignette', label: 'Dark Vignette', desc: 'Center food focus' },
                { id: 'glass', label: 'Glassmorphism', desc: 'Translucent edge' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrameStyle(f.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    frameStyle === f.id
                      ? 'border-gold-500 bg-gold-950/40 text-gold-300 ring-2 ring-gold-500/20'
                      : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-stone-400">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Adjusting Buttons: Zoom, Focus Align, Rotate, Flip & Culinary Color Filters */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
            {/* Left Controls: Zoom, Rotate, Flip, Align */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Adjust Scale & Position:
              </span>

              {/* Zoom Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(100, z - 10))}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 bg-stone-900 border border-stone-800 rounded-lg py-1.5 px-3 text-center text-xs font-mono text-gold-400 font-bold">
                  Zoom: {zoomLevel}%
                </div>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="px-2 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-mono cursor-pointer"
                  title="Reset Scale"
                >
                  Reset
                </button>
              </div>

              {/* Rotation, Flip & Alignment */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-gold-400" />
                  <span>Rotate {rotation}°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlippedH((f) => !f)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFlippedH
                      ? 'bg-gold-500 text-stone-950 font-bold'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  <span>Flip Horizontal</span>
                </button>
              </div>

              {/* Focus Alignment */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400">Crop Focus:</span>
                {(['top', 'center', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setFocusAlign(pos)}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize cursor-pointer ${
                      focusAlign === pos
                        ? 'bg-forest-800 text-emerald-300 font-bold border border-forest-600'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Controls: Culinary Color Filters & Bake Button */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Culinary Food Enhancement Filters:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Natural Colors' },
                  { id: 'vibrant', label: 'Vibrant Spices' },
                  { id: 'warm', label: 'Golden Heritage' },
                  { id: 'crisp', label: 'Crisp & Sharp' },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setFilterPreset(flt.id as any)}
                    className={`p-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                      filterPreset === flt.id
                        ? 'border-gold-400 bg-gold-950/60 text-gold-300 shadow-sm'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Bake & Apply Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isBakingAdjustments}
                  onClick={applyStudioBaking}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-gold-600 hover:from-amber-500 hover:to-gold-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isBakingAdjustments ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Baking Studio Adjustments...</span>
                    </>
                  ) : bakeSuccess ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-stone-950 stroke-3" />
                      <span>Adjustments Saved as Permanent Image!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-stone-950 fill-current" />
                      <span>Save Studio Adjustments Permanently</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-stone-400 text-center block mt-1">
                  Bakes zoom, rotation, and color enhancements into a new high-res WebP image.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal (With Direct Upload to Library Option!) */}
      {showGallery && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Select or Add Photos in Library ({galleryImages.length} images)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Toolbar: Search Bar + Direct "Upload New Photo to Library" Action */}
            <div className="p-4 border-b border-stone-800 bg-stone-950/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search library photos by dish name (e.g. paneer, fish, chicken, kurma, dosa)..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* DIRECT UPLOAD BUTTON INTO GALLERY */}
                <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-forest-700 transition-all cursor-pointer shadow-md hover:shadow-lg shrink-0">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload to Library</span>
                  <input
                    ref={modalFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0], true);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={loadGallery}
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition-colors cursor-pointer shrink-0"
                  title="Refresh library"
                >
                  <RefreshCw className={`w-4 h-4 ${galleryLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Modal Image Grid */}
            <div className="p-5 overflow-y-auto flex-1">
              {galleryLoading ? (
                <div className="flex items-center justify-center py-20 text-stone-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-gold-500 mr-2" />
                  Loading library photos from Cloudinary and Database...
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 text-stone-500 text-xs space-y-3">
                  <ImageIcon className="w-10 h-10 mx-auto text-stone-700" />
                  <div>No images matching &quot;{searchQuery}&quot;</div>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-forest-700 cursor-pointer shadow">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload First Photo to Library</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0], true);
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredImages.map((img) => {
                    const isSelected = value === img.url;
                    const isJustUploaded = justUploadedUrl === img.url;

                    return (
                      <div
                        key={img.url}
                        onClick={() => {
                          onChange(img.url);
                          setShowGallery(false);
                        }}
                        className={`group relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gold-500 ring-4 ring-gold-500/30'
                            : isJustUploaded
                            ? 'border-emerald-400 ring-4 ring-emerald-500/30'
                            : 'border-stone-800 hover:border-gold-400/80 hover:scale-[1.02]'
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.title || img.fileName}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="240px"
                        />

                        {/* Badges: Source or Just Uploaded */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {isJustUploaded && (
                            <span className="bg-emerald-500 text-stone-950 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
                              ✨ Just Added
                            </span>
                          )}
                          {img.source && (
                            <span className="bg-stone-950/80 backdrop-blur-xs text-stone-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-stone-700 uppercase">
                              {img.source}
                            </span>
                          )}
                        </div>

                        {/* Title Caption Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <span className="text-[11px] text-stone-100 font-medium truncate">
                            {img.title || img.fileName}
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
            <div className="p-4 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between text-xs text-stone-400">
              <span>Click any image to set it as this recipe&apos;s photo</span>
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
