import React from 'react';
import { Instagram, MessageCircle, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

interface FooterProps {
  onOpenPolicy: (tab: 'envios' | 'cambios' | 'faq' | 'contacto' | 'privacidad') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  const {
    storeSettings,
    setActiveCategory,
    setIsSizeGuideOpen,
    setIsAdminOpen,
  } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: CategoryId) => {
    setActiveCategory(cat);
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171717] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-white uppercase block">
              Cirleni Hernández
            </span>
            <span className="text-[11px] tracking-[0.2em] text-[#C6A77D] uppercase font-medium block">
              Brand Official · Colombia
            </span>
            <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm">
              Boutique de moda femenina de alta costura inspirada en la autenticidad y sofisticación de la mujer colombiana. Enterizos, vestidos y prendas exclusivas con atención personalizada vía WhatsApp.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2A2A] hover:bg-[#C6A77D] hover:text-[#171717] text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="Instagram Oficial"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2A2A] hover:bg-[#25D366] hover:text-white text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A77D] font-bold block">
              Colecciones
            </span>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => handleCategoryClick('enterizos')}
                  className="hover:text-white transition-colors"
                >
                  Enterizos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('sets')}
                  className="hover:text-white transition-colors"
                >
                  Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('vestidos')}
                  className="hover:text-white transition-colors"
                >
                  Vestidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('bodys')}
                  className="hover:text-white transition-colors"
                >
                  Bodys
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('crop-tops')}
                  className="hover:text-white transition-colors"
                >
                  Crop tops
                </button>
              </li>
            </ul>
          </div>

          {/* Client Service & Sizing */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A77D] font-bold block">
              Servicio al Cliente
            </span>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Guía de Tallas & Medidas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('envios')}
                  className="hover:text-white transition-colors"
                >
                  Información de Envíos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('cambios')}
                  className="hover:text-white transition-colors"
                >
                  Políticas de Cambios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('faq')}
                  className="hover:text-white transition-colors"
                >
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacidad')}
                  className="hover:text-white transition-colors"
                >
                  Términos & Privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Line */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#C6A77D] font-bold block">
              Línea de Pedidos
            </span>
            <div className="space-y-2 text-xs text-[#A8A29E]">
              <p>
                Atención personalizada para cotizaciones y pedidos:
              </p>
              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-bold text-white hover:text-[#C6A77D] block transition-colors"
              >
                {storeSettings.whatsappDisplay}
              </a>
              <span className="text-[11px] text-[#A8A29E] block">
                Lunes a Sábado: 8:00 AM – 8:00 PM (Colombia)
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A29E]">
          <p>
            © {new Date().getFullYear()} {storeSettings.brandName}. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-white text-[11px] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A77D]" />
              <span>Panel de Administración</span>
            </button>

            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              aria-label="Volver arriba"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
