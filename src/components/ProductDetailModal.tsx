import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Sparkles,
  Ruler,
  Check,
  Film,
  Image as ImageIcon,
  Truck,
  RotateCcw,
  MessageCircle,
  AlertCircle,
  Share2
} from 'lucide-react';
import { Product, GarmentSize, GarmentColor } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCOP, calculateDiscount, generateWhatsAppOrderUrl } from '../utils/formatters';
import { getProductImageForColor } from '../utils/imageOptimizer';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutModalOpen,
    storeSettings,
    showNotification,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<GarmentColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'gallery' | 'video'>('gallery');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'detalles' | 'cuidado' | 'medidas'>('detalles');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setSelectedColor(selectedProduct.colors[0] || null);
      setQuantity(1);
      const hasCoverVid =
        selectedProduct.coverMediaType === 'video' &&
        Boolean(selectedProduct.primaryMediaUrl || selectedProduct.videoUrl);
      setViewMode(hasCoverVid ? 'video' : 'gallery');
      setValidationError(null);
      setActiveTab('detalles');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const discount = calculateDiscount(product.price, product.originalPrice);
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedColor) {
      setValidationError('Por favor selecciona un color disponible.');
      return;
    }

    setValidationError(null);
    const result = addToCart(product, selectedColor, quantity);
    if (!result.success && result.message) {
      setValidationError(result.message);
    }
  };

  const handleBuyNowWhatsApp = () => {
    if (!selectedColor) {
      setValidationError('Por favor selecciona un color disponible.');
      return;
    }

    setValidationError(null);
    addToCart(product, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutModalOpen(true);
  };

  const handleColorSelect = (color: GarmentColor) => {
    setSelectedColor(color);
    const matchedImg = getProductImageForColor(product, color.name);
    if (matchedImg) {
      const foundIdx = product.images.findIndex((img) => img === matchedImg);
      if (foundIdx >= 0) {
        setActiveImageIndex(foundIdx);
      }
      setViewMode('gallery');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showNotification('Enlace de la prenda copiado al portapapeles');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const effectiveVideoUrl = product.primaryMediaUrl || product.videoUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        className="relative bg-white sm:rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-0 sm:border border-[#EDE4DA] sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (44x44px touch target) */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-11 h-11 flex items-center justify-center bg-white/95 hover:bg-white text-[#171717] rounded-full shadow-md border border-[#EDE4DA] transition-transform active:scale-95"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Visual Stage (2D Gallery or Video) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#EDE4DA] flex flex-col justify-between">
            
            {/* View Mode Switcher: Fotos vs Video (if product has video) */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#EDE4DA] shadow-2xs">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    viewMode === 'gallery'
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#77716C] hover:text-[#171717]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Fotografías ({product.images?.length || 0})</span>
                </button>

                {effectiveVideoUrl && (
                  <button
                    onClick={() => setViewMode('video')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      viewMode === 'video'
                        ? 'bg-[#C6A77D] text-[#171717] shadow-xs'
                        : 'text-[#77716C] hover:text-[#171717]'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video de la Prenda</span>
                  </button>
                )}
              </div>

              {/* Share & Wishlist in Visual Stage */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-white hover:bg-[#F8F5F0] text-[#77716C] hover:text-[#171717] rounded-full border border-[#EDE4DA] shadow-2xs transition-colors"
                  title="Compartir enlace"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full border border-[#EDE4DA] shadow-2xs transition-colors ${
                    isFavorite
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-[#77716C] hover:text-red-600'
                  }`}
                  title="Guardar en favoritos"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Display Stage: Video or Photo Gallery */}
            {viewMode === 'video' && effectiveVideoUrl ? (
              <div className="relative aspect-[3/4] max-h-[520px] w-full rounded-xl overflow-hidden bg-black border border-[#EDE4DA] shadow-xs flex items-center justify-center">
                <video
                  src={effectiveVideoUrl}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="relative aspect-[4/5] max-h-[350px] sm:aspect-[3/4] sm:max-h-[520px] w-full rounded-xl overflow-hidden bg-white border border-[#EDE4DA] shadow-xs">
                  <img
                    src={product.images[activeImageIndex] || product.images[0] || '/src/assets/images/fashion_enterizo_black_1792782858876.jpg'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center bg-[#FAF8F5]"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-[#171717] text-white rounded">
                        Nuevo
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#C6A77D] text-[#171717] rounded">
                        -{discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails row */}
                {product.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-[#171717] shadow-xs scale-102'
                            : 'border-[#EDE4DA] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} vista ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 text-[11px] text-[#77716C] text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A77D]" />
              <span>Confección artesanal de alta costura · Hecho en Colombia</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Title */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C6A77D] block mb-1">
                  {product.category}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] leading-tight">
                  {product.name}
                </h1>

                {/* Pricing in Colombian Pesos */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-bold text-[#171717] tabular-nums">
                    {formatCOP(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#77716C] line-through tabular-nums">
                      {formatCOP(product.originalPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-[#C6A77D] uppercase tracking-wide">
                      Ahorras {formatCOP(product.originalPrice! - product.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold text-[#171717]">
                    Color seleccionado:
                  </span>
                  <span className="text-[#77716C] font-medium">
                    {selectedColor?.name || 'Selecciona un color'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor?.name === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleColorSelect(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#171717] bg-[#FAF8F5] text-[#171717] shadow-xs'
                            : 'border-[#EDE4DA] hover:border-[#77716C] text-[#77716C]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Sizing Consultation Notice */}
              <div className="p-4 bg-[#FAF8F5] border border-[#C6A77D]/40 rounded-xl space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>¿Dudas con tu talla? Coordinamos tu talla por WhatsApp</span>
                </div>
                <p className="text-xs text-[#77716C] leading-relaxed">
                  Al confirmar tu pedido, nuestra asesora te contactará directamente por WhatsApp para definir y asegurar la talla ideal para ti.
                </p>
              </div>

              {/* Mandatory Validation Warning */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-[#171717]">Cantidad:</span>
                <div className="flex items-center border border-[#EDE4DA] rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-xs text-[#171717] hover:bg-[#FAF8F5] disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold tabular-nums min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    disabled={quantity >= 99}
                    className="w-10 h-10 flex items-center justify-center text-xs text-[#171717] hover:bg-[#FAF8F5] disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full min-h-[48px] py-3.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C6A77D]" />
                  <span>Agregar a la Bolsa</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNowWhatsApp}
                  className="w-full min-h-[48px] py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Finalizar Pedido por WhatsApp</span>
                </button>
              </div>

              {/* Accordion Tabs (Detalles, Cuidado, Medidas) */}
              <div className="pt-4 border-t border-[#EDE4DA]">
                <div className="flex items-center border-b border-[#EDE4DA] mb-3">
                  <button
                    onClick={() => setActiveTab('detalles')}
                    className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === 'detalles'
                        ? 'border-[#171717] text-[#171717] font-semibold'
                        : 'border-transparent text-[#77716C] hover:text-[#171717]'
                    }`}
                  >
                    Descripción
                  </button>
                  <button
                    onClick={() => setActiveTab('cuidado')}
                    className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === 'cuidado'
                        ? 'border-[#171717] text-[#171717] font-semibold'
                        : 'border-transparent text-[#77716C] hover:text-[#171717]'
                    }`}
                  >
                    Composición & Cuidado
                  </button>
                  {product.measurementsGuide && (
                    <button
                      onClick={() => setActiveTab('medidas')}
                      className={`py-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                        activeTab === 'medidas'
                          ? 'border-[#171717] text-[#171717] font-semibold'
                          : 'border-transparent text-[#77716C] hover:text-[#171717]'
                      }`}
                    >
                      Medidas
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#77716C] leading-relaxed">
                  {activeTab === 'detalles' && (
                    <div className="space-y-2">
                      <p>{product.description}</p>
                      <p>
                        <strong className="text-[#171717]">Material:</strong> {product.material}
                      </p>
                    </div>
                  )}

                  {activeTab === 'cuidado' && (
                    <div className="space-y-2">
                      <p>
                        <strong className="text-[#171717]">Composición:</strong> {product.composition}
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        {product.careInstructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'medidas' && product.measurementsGuide && (
                    <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded-lg border border-[#EDE4DA]">
                      <p><strong>Busto:</strong> {product.measurementsGuide.bust}</p>
                      <p><strong>Cintura:</strong> {product.measurementsGuide.waist}</p>
                      <p><strong>Cadera:</strong> {product.measurementsGuide.hip}</p>
                      <p><strong>Largo:</strong> {product.measurementsGuide.length}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping & Assistance Guarantee */}
              <div className="pt-2 flex flex-col gap-2 text-[11px] text-[#77716C]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C6A77D]" />
                  <span>Envíos asegurados a toda Colombia (Servientrega / Interrapidísimo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Atención directa al <strong>{storeSettings.whatsappDisplay}</strong></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
