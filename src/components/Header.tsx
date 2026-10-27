import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsAdminOpen,
    storeSettings,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: CategoryId; label: string }[] = [
    { id: 'enterizos', label: 'Enterizos' },
    { id: 'sets', label: 'Sets' },
    { id: 'vestidos', label: 'Vestidos' },
    { id: 'bodys', label: 'Bodys' },
    { id: 'crop-tops', label: 'Crop tops' },
  ];

  const handleNavClick = (id: CategoryId) => {
    setActiveCategory(id);
    setMobileMenuOpen(false);
    // Smooth scroll to catalog section if not already in view
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {!bannerDismissed && (
        <div className="bg-[#171717] text-[#FAF8F5] text-xs py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="w-6" /> {/* spacer for balance */}
            <p className="text-center font-normal tracking-wide text-[11px] sm:text-xs">
              {storeSettings.announcementText}
            </p>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-[#FAF8F5]/60 hover:text-white transition-colors text-xs p-1"
              aria-label="Cerrar anuncio"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#EDE4DA]'
            : 'bg-white/90 backdrop-blur-xs border-b border-[#EDE4DA]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Bar 3-Zone Contract */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 md:gap-8">
            
            {/* Zone 1: Brand Wordmark / Official Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('todos')}
                className="flex items-center gap-2 sm:gap-3 text-left group focus-visible:outline-hidden"
              >
                {!logoLoadError && storeSettings.logoUrl ? (
                  <img
                    src={storeSettings.logoUrl}
                    alt={storeSettings.brandName}
                    referrerPolicy="no-referrer"
                    onError={() => setLogoLoadError(true)}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-[#C6A77D]/40 shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#171717] text-[#C6A77D] flex items-center justify-center font-serif text-base sm:text-lg font-bold border border-[#C6A77D]/50 shadow-xs shrink-0">
                    CH
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-lg md:text-xl font-semibold tracking-wider text-[#171717] uppercase leading-tight truncate max-w-[160px] xs:max-w-[200px] sm:max-w-none">
                    Cirleni Hernández
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[#C6A77D] uppercase font-medium">
                    Brand Official · Colombia
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => {
                const isActive = activeCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm tracking-wide transition-colors whitespace-nowrap font-medium relative py-1 ${
                      isActive
                        ? 'text-[#171717] font-semibold'
                        : 'text-[#77716C] hover:text-[#171717]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A77D] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Interactive Affordances */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#171717] hover:text-[#C6A77D] hover:bg-[#F8F5F0] rounded-full transition-colors relative"
                aria-label="Buscar prendas"
                title="Buscar en la tienda"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#171717] hover:text-[#C6A77D] hover:bg-[#F8F5F0] rounded-full transition-colors relative"
                aria-label="Ver favoritos"
                title="Prendas favoritas"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#171717] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="min-h-[40px] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 bg-[#171717] text-[#FAF8F5] rounded-lg hover:bg-[#2A2A2A] transition-colors shadow-xs"
                aria-label="Abrir carrito de compras"
              >
                <ShoppingBag className="w-4 h-4 text-[#C6A77D]" />
                <span className="hidden sm:inline-block text-xs font-medium tracking-wide">Bolsa</span>
                <span className="bg-[#C6A77D] text-[#171717] text-[11px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                  {cartCount}
                </span>
              </button>

              {/* Admin Portal Quick Icon */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hidden xl:flex items-center gap-1 p-2 text-[#77716C] hover:text-[#171717] text-xs transition-colors"
                title="Panel Administrativo de Boutique"
              >
                <ShieldCheck className="w-4 h-4 text-[#C6A77D]" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-[#171717] hover:bg-[#F8F5F0] rounded-lg lg:hidden transition-colors"
                aria-label="Abrir menú de navegación"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Live Search Expandable Bar */}
        {searchOpen && (
          <div className="bg-[#FAF8F5] border-t border-b border-[#EDE4DA] py-3 px-4 transition-all">
            <div className="max-w-2xl mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-[#77716C] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por enterizos, vestidos de gala, lino, satén, color..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EDE4DA] rounded-lg text-base sm:text-sm text-[#171717] focus:outline-hidden focus:border-[#C6A77D] transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-[#77716C] hover:text-[#171717] text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#EDE4DA] px-4 pt-3 pb-6 space-y-2 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="text-[11px] uppercase tracking-widest text-[#77716C] px-3 pt-2 font-semibold">
              Colecciones Cirleni Hernández
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  activeCategory === item.id
                    ? 'bg-[#FAF8F5] text-[#171717] font-semibold border-l-4 border-[#C6A77D]'
                    : 'text-[#77716C] hover:text-[#171717] hover:bg-[#FAF8F5]/60'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#C6A77D]" />
              </button>
            ))}

            <div className="pt-4 border-t border-[#EDE4DA] flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs text-[#77716C] hover:text-[#171717] py-2 min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-[#C6A77D]" />
                <span>Panel Administrativo</span>
              </button>
              
              <a
                href={storeSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C6A77D] font-semibold py-2"
              >
                @cirlenihernandez
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
