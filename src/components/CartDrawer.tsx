import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../utils/formatters';
import { GarmentSize, GarmentColor } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
    clearCart,
    cartTotal,
    cartCount,
    setIsCheckoutModalOpen,
    storeSettings,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div
        className="fixed inset-0"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-[#EDE4DA]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EDE4DA] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C6A77D]" />
            <h2 className="font-serif text-lg font-bold text-[#171717]">
              Bolsa de Compras
            </h2>
            <span className="text-xs bg-[#171717] text-white px-2 py-0.5 rounded-full font-bold tabular-nums">
              {cartCount}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-[#77716C] hover:text-[#171717] rounded-full hover:bg-white transition-colors"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Notice */}
        <div className="bg-[#F8F5F0] px-5 py-2.5 border-b border-[#EDE4DA] text-xs">
          {cartTotal >= storeSettings.freeShippingThreshold ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Calificas para asesoría de envío prioritario!</span>
            </div>
          ) : (
            <div className="text-[#77716C]">
              Agrega{' '}
              <strong className="text-[#171717] tabular-nums">
                {formatCOP(storeSettings.freeShippingThreshold - cartTotal)}
              </strong>{' '}
              más para beneficios de envío preferencial.
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EDE4DA]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#EDE4DA]">
                <ShoppingBag className="w-8 h-8 text-[#C6A77D]" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-semibold text-[#171717]">
                  Tu bolsa está vacía
                </p>
                <p className="text-xs text-[#77716C] max-w-xs">
                  Descubre enterizos, vestidos de alta costura y conjuntos diseñados para deslumbrar.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#2A2A2A] transition-colors"
              >
                Explorar Colección
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const maxStock =
                item.product.inventory?.find(
                  (v) =>
                    v.size === item.selectedSize &&
                    v.color.toLowerCase() === item.selectedColor.name.toLowerCase()
                )?.stock ?? 99;

              return (
                <div key={item.id} className="py-4 first:pt-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-lg border border-[#EDE4DA] bg-[#FAF8F5] shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#171717] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#77716C] hover:text-red-600 p-1 transition-colors"
                          title="Eliminar de la bolsa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Selectors inside Cart */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#77716C]">
                        <span className="text-[#C6A77D] font-medium">Talla: A coordinar por WhatsApp</span>

                        <span aria-hidden="true">·</span>

                        {/* Color indicator */}
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#EDE4DA] rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs text-[#77716C] hover:text-[#171717] active:bg-[#FAF8F5] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-bold tabular-nums min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= maxStock}
                          className="w-8 h-8 flex items-center justify-center text-xs text-[#77716C] hover:text-[#171717] disabled:opacity-30 active:bg-[#FAF8F5] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#171717] tabular-nums block">
                          {formatCOP(item.unitPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-[#77716C] tabular-nums block">
                            {formatCOP(item.unitPrice)} c/u
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 pb-safe border-t border-[#EDE4DA] bg-[#FAF8F5] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#77716C]">
                <span>Subtotal de prendas</span>
                <span className="font-medium tabular-nums">{formatCOP(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#77716C]">
                <span>Flete / Envío nacional</span>
                <span className="text-emerald-700 font-medium">Por confirmar vía WhatsApp</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-[#171717] pt-2 border-t border-[#EDE4DA]">
                <span>Total Estimado</span>
                <span className="tabular-nums text-base">{formatCOP(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="w-full min-h-[48px] py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Finalizar Pedido por WhatsApp</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#77716C]">
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="hover:text-[#171717] underline transition-colors py-1"
              >
                Seguir explorando
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-600 transition-colors py-1"
              >
                Vaciar bolsa
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
