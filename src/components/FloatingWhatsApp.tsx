import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FloatingWhatsApp: React.FC = () => {
  const { storeSettings, cartCount, setIsCheckoutModalOpen } = useStore();
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleClick = () => {
    if (cartCount > 0) {
      setIsCheckoutModalOpen(true);
    } else {
      const msg = encodeURIComponent(
        `¡Hola Cirleni Hernández! Me gustaría recibir asesoría sobre la nueva colección de prendas.`
      );
      window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,16px))] right-3 sm:right-6 z-30 flex flex-col items-end gap-2">
      {/* Tooltip bubble on desktop */}
      {tooltipOpen && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#171717] px-3.5 py-2 rounded-xl shadow-xl border border-[#EDE4DA] text-xs font-medium animate-fade-in">
          <span>¿Deseas asesoría en tu pedido?</span>
          <button
            onClick={() => setTooltipOpen(false)}
            className="text-[#77716C] hover:text-[#171717] p-0.5"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-hidden"
        aria-label="Contactar por WhatsApp"
        title="Contactar a la boutique por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
      </button>
    </div>
  );
};
