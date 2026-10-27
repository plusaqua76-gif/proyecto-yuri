import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { TESTIMONIALS, ASSET_IMAGES } from '../data/initialProducts';

export const BrandStory: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-[#EDE4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Editorial Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#EDE4DA] aspect-[4/3] sm:aspect-[16/10]">
              <img
                src="/assets/aistudio/imgdownloader-080c057c_9fa09d13.jpeg"
                alt="Confección y esencia Cirleni Hernández"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C6A77D] font-bold block">
                  Atelier Colombiano
                </span>
                <p className="font-serif text-lg font-semibold">
                  Pasión por el detalle, la silueta y las texturas nobles
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A77D] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Nuestra Esencia</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] leading-tight">
              Diseños que resaltan tu esencia más auténtica
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-[#77716C]">
              "En Cirleni Hernández creemos que cada mujer merece sentirse única, segura y auténtica. Nuestra moda está pensada para resaltar tu esencia, acompañarte en cada ocasión y convertir cada prenda en una expresión de tu personalidad."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDE4DA]">
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#171717]">
                  Elegancia en cada detalle
                </h4>
                <p className="text-xs text-[#77716C] leading-relaxed">
                  Patronaje preciso que abraza y favorece las proporciones femeninas reales.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#171717]">
                  Tu momento, tu estilo
                </h4>
                <p className="text-xs text-[#77716C] leading-relaxed">
                  Telas con caídas excepcionales: satén, lino, crepé y sedas seleccionadas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials of Real Clients */}
        <div className="space-y-8 pt-8 border-t border-[#EDE4DA]">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C6A77D] font-semibold">
              Experiencias de Nuestras Clientas
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
              Confianza que se viste con orgullo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EDE4DA] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C6A77D]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#171717] leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDE4DA]/80">
                  <span className="font-serif text-sm font-bold text-[#171717] block">
                    {t.author}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-[#77716C] mt-0.5">
                    <span>{t.city}</span>
                    <span className="text-[#C6A77D] font-medium">{t.garment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
