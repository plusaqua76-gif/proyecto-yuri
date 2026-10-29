import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Film, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCOP, calculateDiscount } from '../utils/formatters';
import { getProductImageForColor, getThumbnailUrl } from '../utils/imageOptimizer';
import { OptimizedImage } from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail, priority = false }) => {
  const {
    isInWishlist,
    toggleWishlist,
    setSelectedProduct,
    setQuickViewProduct,
    addToCart,
    addRecentlyViewed,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedColorImage, setSelectedColorImage] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.originalPrice);
  const isFavorite = isInWishlist(product.id);

  // Active media: check if video is selected as cover
  const isCoverVideo = product.coverMediaType === 'video' && Boolean(product.primaryMediaUrl || product.videoUrl);
  const coverVideoSrc = product.primaryMediaUrl || product.videoUrl;

  const mainImage = product.images?.[0] || '';
  // Avoid computing or fetching secondary image until hovered
  const currentImage = isHovered && product.images && product.images.length > 1 ? product.images[1] : mainImage;

  const handleCardClick = () => {
    addRecentlyViewed(product);
    if (onOpenDetail) {
      onOpenDetail(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleColorClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setSelectedColorIndex(idx);
    const color = product.colors[idx];
    if (color) {
      const matched = getProductImageForColor(product, color.name);
      if (matched) {
        setSelectedColorImage(matched);
      }
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Pick first available size & selected color
    const defaultColor = product.colors[selectedColorIndex] || product.colors[0];
    const defaultSize = (product.sizes && product.sizes[0]) || 'M';

    const res = addToCart(product, defaultColor, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentlyViewed(product);
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Determine media to render:
  // 1. If user clicked a color that has a photo, show that photo!
  // 2. Otherwise if cover is video, play video.
  // 3. Otherwise show standard image gallery preview with lightweight WebP thumbnail.
  const rawImage = selectedColorImage || currentImage;
  const displayedImage = getThumbnailUrl(rawImage);
  const showVideo = !selectedColorImage && isCoverVideo && Boolean(coverVideoSrc);

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-[#EDE4DA] hover:border-[#C6A77D]/60 hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image / Video Stage */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF8F5] overflow-hidden">
        {showVideo ? (
          <video
            src={coverVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload={priority ? 'metadata' : 'none'}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104"
          />
        ) : (
          <OptimizedImage
            src={displayedImage || '/src/assets/images/fashion_enterizo_black_1792782858876_thumb.webp'}
            alt={product.name}
            priority={priority}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104"
          />
        )}

        {/* Status Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-[#171717] text-white rounded">
              Nuevo
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#C6A77D] text-[#171717] rounded">
              -{discount}% OFF
            </span>
          )}
          {product.isExclusive && (
            <span className="text-[10px] uppercase font-medium tracking-wider px-2.5 py-1 bg-white/95 text-[#171717] border border-[#EDE4DA] rounded">
              Exclusivo
            </span>
          )}
        </div>

        {/* Video Badge if product has video */}
        {product.videoUrl && (
          <div className="absolute top-3 right-12 z-10">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.8 bg-white/95 text-[#171717] border border-[#C6A77D]/60 rounded shadow-2xs">
              <Film className="w-3 h-3 text-[#C6A77D]" />
              <span>Video</span>
            </span>
          </div>
        )}

        {/* Wishlist Heart Toggle (44x44px touch target) */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-2xs ${
            isFavorite
              ? 'bg-red-50 text-red-600 shadow-xs'
              : 'bg-white/85 text-[#77716C] hover:text-red-600 hover:bg-white active:scale-90'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Quick Add Action Bar (Desktop Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 py-2.5 bg-white/95 hover:bg-white text-[#171717] text-xs font-semibold uppercase tracking-wider rounded shadow-md transition-colors flex items-center justify-center gap-1.5"
            title="Vista rápida"
          >
            <Eye className="w-3.5 h-3.5 text-[#77716C]" />
            <span>Vista Rápida</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`p-2.5 rounded shadow-md transition-colors ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#171717] hover:bg-[#C6A77D] text-white active:scale-95'
            }`}
            title={justAdded ? 'Agregado' : 'Agregar a la bolsa'}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          {/* Category & Zero-pill metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#77716C] uppercase tracking-wider font-medium mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>Alta Costura</span>
          </div>

          <h3 className="font-serif text-base font-semibold text-[#171717] line-clamp-1 group-hover:text-[#C6A77D] transition-colors">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-xs text-[#77716C] line-clamp-1 mt-0.5 font-normal">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Available Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => handleColorClick(e, idx)}
                className={`p-1 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                  selectedColorIndex === idx ? 'scale-110' : ''
                }`}
                title={c.name}
                aria-label={c.name}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border block ${
                    selectedColorIndex === idx
                      ? 'border-[#171717] ring-2 ring-[#C6A77D]'
                      : 'border-black/20'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
            <span className="text-[11px] text-[#77716C] ml-1 truncate">
              {product.colors[selectedColorIndex]?.name}
            </span>
          </div>
        )}

        {/* Sizes and Price */}
        <div className="flex items-baseline justify-between pt-2 border-t border-[#EDE4DA]/80">
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-semibold text-[#171717] tabular-nums">
              {formatCOP(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#77716C] line-through tabular-nums">
                {formatCOP(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Sizing note */}
          <div className="text-[10px] text-[#C6A77D] font-medium tracking-wide">
            💬 Asesoría de talla vía WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
};
