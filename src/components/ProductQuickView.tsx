import React, { useState } from 'react';
import { X, ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/formatters';
import { getProductImageForColor } from '../utils/imageOptimizer';

export const ProductQuickView: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setSelectedProduct,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [colorImage, setColorImage] = useState<string | null>(null);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);

  const handleOpenFull = () => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
  };

  const handleColorClick = (colorName: string) => {
    setSelectedColorName(colorName);
    const matchedImg = getProductImageForColor(product, colorName);
    if (matchedImg) {
      setColorImage(matchedImg);
    }
  };

  const isCoverVid = !colorImage && product.coverMediaType === 'video' && Boolean(product.primaryMediaUrl || product.videoUrl);
  const displayedImg = colorImage || product.images?.[0] || '/src/assets/images/fashion_enterizo_black_1792782858876.jpg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDE4DA] relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-11 h-11 flex items-center justify-center bg-white/95 hover:bg-white text-[#171717] rounded-full shadow-md border border-[#EDE4DA] active:scale-95"
          aria-label="Cerrar vista rápida"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="aspect-[3/4] bg-[#FAF8F5] relative overflow-hidden">
            {isCoverVid ? (
              <video
                src={product.primaryMediaUrl || product.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={displayedImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C6A77D] font-bold block mb-1">
                {product.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#171717] leading-snug">
                {product.name}
              </h3>
              <p className="text-base font-bold text-[#171717] mt-2 tabular-nums">
                {formatCOP(product.price)}
              </p>
              <p className="text-xs text-[#77716C] mt-2 line-clamp-3">
                {product.description}
              </p>

              {/* Colores disponibles */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#EDE4DA]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#171717] mb-1.5">
                    <span>Colores disponibles:</span>
                    <span className="text-[#C6A77D]">
                      {selectedColorName || product.colors[0]?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => {
                      const isSelected = (selectedColorName || product.colors[0]?.name) === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleColorClick(c.name)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border transition-all ${
                            isSelected
                              ? 'border-[#171717] bg-[#FAF8F5] font-bold text-[#171717]'
                              : 'border-[#EDE4DA] text-[#77716C] hover:border-[#171717]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tallas disponibles */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-[#171717] block mb-1.5">
                  Tallas disponibles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 bg-[#FAF8F5] text-[#171717] text-[11px] font-bold rounded border border-[#EDE4DA]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={handleOpenFull}
                className="w-full py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Ver Detalles & Comprar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A77D]" />
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-2 bg-[#FAF8F5] hover:bg-[#EDE4DA]/60 text-[#171717] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                <span>{isFavorite ? 'En tus favoritos' : 'Añadir a favoritos'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
