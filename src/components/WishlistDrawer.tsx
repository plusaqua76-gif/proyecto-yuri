import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/formatters';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    setSelectedProduct,
    addToCart,
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  const handleOpenDetail = (p: typeof products[0]) => {
    setSelectedProduct(p);
    setIsWishlistOpen(false);
  };

  const handleMoveToCart = (p: typeof products[0]) => {
    const size = (p.sizes && p.sizes[0]) || "WhatsApp" || 'M';
    const color = p.colors[0];
    addToCart(p, color, 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="fixed inset-0"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-[#EDE4DA]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EDE4DA] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-current" />
            <h2 className="font-serif text-lg font-bold text-[#171717]">
              Prendas Favoritas
            </h2>
            <span className="text-xs bg-[#171717] text-white px-2 py-0.5 rounded-full font-bold tabular-nums">
              {favoriteProducts.length}
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 text-[#77716C] hover:text-[#171717] rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EDE4DA]">
          {favoriteProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#EDE4DA]">
                <Heart className="w-8 h-8 text-[#77716C]" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-semibold text-[#171717]">
                  No tienes prendas guardadas
                </p>
                <p className="text-xs text-[#77716C] max-w-xs">
                  Haz clic en el corazón de cualquier prenda para guardarla y revisarla cuando desees.
                </p>
              </div>
            </div>
          ) : (
            favoriteProducts.map((p) => (
              <div key={p.id} className="py-4 first:pt-0 flex gap-3.5">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-cover rounded-lg border border-[#EDE4DA] bg-[#FAF8F5] shrink-0 cursor-pointer"
                  onClick={() => handleOpenDetail(p)}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4
                        onClick={() => handleOpenDetail(p)}
                        className="font-serif text-sm font-semibold text-[#171717] line-clamp-1 cursor-pointer hover:text-[#C6A77D]"
                      >
                        {p.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[#77716C] hover:text-red-600 p-1"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-[#77716C] uppercase tracking-wider block mt-0.5">
                      {p.category}
                    </span>

                    <span className="text-xs font-semibold text-[#171717] tabular-nums block mt-1">
                      {formatCOP(p.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleMoveToCart(p)}
                      className="px-3 py-1.5 bg-[#171717] text-white hover:bg-[#C6A77D] text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>A la bolsa</span>
                    </button>
                    <button
                      onClick={() => handleOpenDetail(p)}
                      className="text-[11px] text-[#77716C] hover:text-[#171717] underline ml-auto"
                    >
                      Ver prenda
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
