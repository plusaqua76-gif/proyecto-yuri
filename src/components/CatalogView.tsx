import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Tag,
  Grid3X3,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CategoryId, GarmentSize } from '../types';
import { CATEGORIES_LIST } from '../data/initialProducts';
import { formatCOP } from '../utils/formatters';

export const CatalogView: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsAdminOpen,
  } = useStore();

  const highestPriceInCatalog = useMemo(() => {
    if (!products || products.length === 0) return 1000000;
    const prices = products.map((p) => Number(p.price) || 0);
    return Math.max(...prices, 800000);
  }, [products]);

  const [selectedColorHex, setSelectedColorHex] = useState<string | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<'3' | '4'>('3');

  // Progressive loading (renders initial 12 products as requested)
  const [visibleCount, setVisibleCount] = useState(12);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, searchQuery, selectedColorHex, maxPrice, sortBy]);

  // Collect all unique colors from current catalog
  const availableColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        if (!map.has(c.hex)) {
          map.set(c.hex, c);
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Flexible Category Matching (case-insensitive & synonym friendly)
      if (activeCategory !== 'todos') {
        const pCat = (product.category || '').toLowerCase().trim();
        const aCat = activeCategory.toLowerCase().trim();

        const matchesCat =
          pCat === aCat ||
          pCat.startsWith(aCat) ||
          aCat.startsWith(pCat) ||
          (aCat === 'sets' && (pCat.includes('set') || pCat.includes('conjunto') || pCat.includes('dos piezas') || pCat.includes('2 piezas'))) ||
          (aCat === 'enterizos' && (pCat.includes('enteriz') || pCat.includes('jumpsuit') || pCat.includes('mono'))) ||
          (aCat === 'vestidos' && (pCat.includes('vestid') || pCat.includes('dress'))) ||
          (aCat === 'bodys' && pCat.includes('body')) ||
          (aCat === 'crop-tops' && (pCat.includes('crop') || pCat.includes('top') || pCat.includes('blusa') || pCat.includes('camisa')));

        if (!matchesCat) return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = (product.category || '').toLowerCase().includes(q);
        const matchesColor = product.colors?.some((c) => c.name.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesColor) return false;
      }

      // 3. Color filter
      if (selectedColorHex !== 'all') {
        if (!product.colors?.some((c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase())) {
          return false;
        }
      }

      // 4. Price filter
      if (product.price && product.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // default featured
    });
  }, [
    products,
    activeCategory,
    searchQuery,
    selectedColorHex,
    maxPrice,
    sortBy,
  ]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Automatically load next 12 products when user scrolls near the bottom of screen
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length]);

  const resetAllFilters = () => {
    setActiveCategory('todos');
    setSelectedColorHex('all');
    setMaxPrice(highestPriceInCatalog);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    activeCategory !== 'todos' ||
    selectedColorHex !== 'all' ||
    maxPrice < 300000 ||
    searchQuery.length > 0;

  return (
    <section id="catalogo" className="py-12 md:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EDE4DA]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A77D] font-semibold mb-1">
              <span>Boutique Lookbook</span>
              <span aria-hidden="true">·</span>
              <span>Confección Exclusiva</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#171717]">
              Catálogo de Prendas
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Filter Count & Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 text-xs text-[#77716C] hover:text-[#171717] underline transition-colors py-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden min-h-[40px] flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EDE4DA] rounded-lg text-xs font-semibold text-[#171717] shadow-2xs active:bg-[#FAF8F5]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C6A77D]" />
              <span>{mobileFiltersOpen ? 'Ocultar Filtros' : 'Filtros'}</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="min-h-[40px] bg-white border border-[#EDE4DA] rounded-lg text-xs font-medium text-[#171717] py-2 pl-3 pr-8 focus:outline-hidden focus:border-[#C6A77D]"
              >
                <option value="featured">Novedades & Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name">Nombre: A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tab Strip (Clean unboxed/segmented interactive buttons with edge-to-edge scroll on mobile) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as CategoryId)}
                className={`min-h-[40px] px-4 py-2 rounded-xl sm:rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-[#F8F5F0] text-[#77716C] hover:text-[#171717] border border-[#EDE4DA]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Layout: Sidebar Filters (Desktop/Mobile) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filter Sidebar */}
          <aside
            className={`lg:col-span-3 bg-white p-5 rounded-2xl border border-[#EDE4DA] space-y-6 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
              <span className="font-serif text-sm font-bold text-[#171717]">
                Filtrar Selección
              </span>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#C6A77D] hover:underline"
                  >
                    Restablecer
                  </button>
                )}
                {mobileFiltersOpen && (
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="lg:hidden text-xs text-[#171717] font-semibold bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#EDE4DA]"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>



            {/* Color Swatches Filter */}
            <div>
              <span className="text-xs font-semibold text-[#171717] block mb-2.5">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColorHex('all')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                    selectedColorHex === 'all'
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-[#FAF8F5] text-[#77716C] border-[#EDE4DA]'
                  }`}
                >
                  Todos
                </button>
                {availableColors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColorHex(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      selectedColorHex.toLowerCase() === c.hex.toLowerCase()
                        ? 'scale-125 border-[#171717] ring-2 ring-[#C6A77D]'
                        : 'border-black/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#171717]">Precio Máximo:</span>
                <span className="font-bold text-[#171717] tabular-nums">
                  {formatCOP(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={highestPriceInCatalog}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#171717] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#77716C] mt-1 tabular-nums">
                <span>$50.000 COP</span>
                <span>{formatCOP(highestPriceInCatalog)}</span>
              </div>
            </div>



          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Meta indicator bar */}
            <div className="flex items-center justify-between text-xs text-[#77716C]">
              <span>
                Mostrando <strong className="text-[#171717] tabular-nums">{filteredProducts.length}</strong> diseño(s) exclusivos
              </span>

              {searchQuery && (
                <span>
                  Resultados para: <em className="text-[#171717]">"{searchQuery}"</em>
                </span>
              )}
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EDE4DA] p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C6A77D] border border-[#EDE4DA]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#171717]">
                    Tu catálogo está listo para recibir tus prendas originales
                  </h3>
                  <p className="text-xs text-[#77716C] max-w-md mx-auto">
                    La base de datos en la nube está conectada. Abre el Panel de Administración para publicar tus vestidos, enterizos y creaciones con fotos o videos.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-6 py-2.5 bg-[#171717] hover:bg-[#C6A77D] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publicar Primera Prenda</span>
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EDE4DA] p-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#77716C] border border-[#EDE4DA]">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#171717]">
                    No encontramos prendas con estos filtros
                  </h3>
                  <p className="text-xs text-[#77716C] max-w-sm mx-auto">
                    Prueba cambiando los filtros de talla, color o precio para ver más creaciones.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#2A2A2A]"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              /* Product Cards Grid with Automatic On-Scroll Infinite Loading */
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 4}
                    />
                  ))}
                </div>

                {/* Sentinel Element & Loading Indicator for On-Scroll Infinite Loading */}
                {visibleCount < filteredProducts.length ? (
                  <div
                    ref={observerRef}
                    className="pt-6 pb-2 text-center flex flex-col items-center justify-center gap-2"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EDE4DA] rounded-full text-xs font-semibold text-[#77716C] shadow-2xs">
                      <Loader2 className="w-3.5 h-3.5 text-[#C6A77D] animate-spin" />
                      <span>Cargando más prendas a medida que exploras ({filteredProducts.length - visibleCount} restantes)...</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6 text-center text-xs font-medium text-[#77716C] tracking-wide">
                    ✨ Has visto todas las {filteredProducts.length} prendas de esta sección
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
