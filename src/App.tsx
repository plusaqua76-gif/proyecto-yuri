import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CatalogView } from './components/CatalogView';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppCheckoutModal } from './components/WhatsAppCheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { PoliciesModal } from './components/PoliciesModal';
import { AdminPanel } from './components/AdminPanel';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductCard } from './components/ProductCard';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    products,
    setActiveCategory,
    notificationMessage,
  } = useStore();

  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [initialPolicyTab, setInitialPolicyTab] = useState<'envios' | 'cambios' | 'faq' | 'contacto' | 'privacidad'>('envios');

  const openPolicy = (tab: 'envios' | 'cambios' | 'faq' | 'contacto' | 'privacidad') => {
    setInitialPolicyTab(tab);
    setPolicyModalOpen(true);
  };

  // Curated spotlight collections for Home Sections
  const enterizosSpotlight = products.filter((p) => p.category === 'enterizos').slice(0, 3);
  const vestidosSpotlight = products.filter((p) => p.category === 'vestidos').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
      {/* Toast Notification */}
      {notificationMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#171717] text-white px-4 py-3 rounded-xl shadow-xl border border-[#C6A77D]/40 text-xs font-medium flex items-center gap-2.5 animate-slide-down">
          <Check className="w-4 h-4 text-[#C6A77D]" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Featured Section 1: Enterizos que Enamoran (Only if items exist) */}
        {enterizosSpotlight.length > 0 && (
          <section className="py-12 md:py-16 bg-white border-b border-[#EDE4DA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A77D] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Siluetas Icónicas</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#171717]">
                    Enterizos que Enamoran
                  </h2>
                  <p className="text-xs text-[#77716C] mt-1">
                    Estructuras de alta costura que estilizan la postura con elegancia insuperable.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory('enterizos');
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:text-[#C6A77D] transition-colors"
                >
                  <span>Ver todos los enterizos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {enterizosSpotlight.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Section 2: Vestidos de Gala & Celebración (Only if items exist) */}
        {vestidosSpotlight.length > 0 && (
          <section className="py-12 md:py-16 bg-[#FAF8F5] border-b border-[#EDE4DA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A77D] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Noche & Cóctel</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#171717]">
                    Vestidos para Cada Ocasión
                  </h2>
                  <p className="text-xs text-[#77716C] mt-1">
                    Seda, lamé y caídas fluidas diseñadas para tus momentos inolvidables.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory('vestidos');
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:text-[#C6A77D] transition-colors"
                >
                  <span>Ver todos los vestidos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {vestidosSpotlight.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full Interactive Smart Catalog with Filters */}
        <CatalogView />

        {/* Brand Editorial & Testimonials */}
        <BrandStory />
      </main>

      {/* Footer */}
      <Footer onOpenPolicy={openPolicy} />

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <ProductQuickView />
      <CartDrawer />
      <WhatsAppCheckoutModal />
      <WishlistDrawer />
      <SizeGuideModal />
      <PoliciesModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={initialPolicyTab}
      />
      <AdminPanel />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
