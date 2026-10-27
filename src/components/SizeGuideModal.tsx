import React from 'react';
import { X, Ruler, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDE4DA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDE4DA] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F8F5F0] rounded-lg text-[#C6A77D]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#171717]">
                Guía de Tallas & Medidas
              </h2>
              <p className="text-xs text-[#77716C]">
                Cirleni Hernández Brand Official · Colombia
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-2 text-[#77716C] hover:text-[#171717] rounded-full hover:bg-[#F8F5F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-[#77716C] leading-relaxed">
            Nuestras prendas están confeccionadas siguiendo el estándar de silueta colombiana con patrones de alta costura. Utiliza una cinta métrica flexible ajustada al cuerpo sin apretar.
          </p>

          {/* Measurements Table */}
          <div className="overflow-x-auto border border-[#EDE4DA] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#171717] uppercase tracking-wider text-[11px] font-semibold border-b border-[#EDE4DA]">
                <tr>
                  <th className="py-3 px-4">Talla</th>
                  <th className="py-3 px-4">Busto (cm)</th>
                  <th className="py-3 px-4">Cintura (cm)</th>
                  <th className="py-3 px-4">Cadera (cm)</th>
                  <th className="py-3 px-4">Equivalencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE4DA] tabular-nums text-[#171717]">
                <tr className="hover:bg-[#FAF8F5]/50">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">XS (6)</td>
                  <td className="py-3 px-4">82 - 85</td>
                  <td className="py-3 px-4">62 - 65</td>
                  <td className="py-3 px-4">90 - 93</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 6</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/50 bg-[#FAF8F5]/20">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">S (8)</td>
                  <td className="py-3 px-4">86 - 89</td>
                  <td className="py-3 px-4">66 - 69</td>
                  <td className="py-3 px-4">94 - 97</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 8</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/50">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">M (10)</td>
                  <td className="py-3 px-4">90 - 94</td>
                  <td className="py-3 px-4">70 - 74</td>
                  <td className="py-3 px-4">98 - 102</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 10</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/50 bg-[#FAF8F5]/20">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">L (12)</td>
                  <td className="py-3 px-4">95 - 100</td>
                  <td className="py-3 px-4">75 - 80</td>
                  <td className="py-3 px-4">103 - 108</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 12</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/50">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">XL (14)</td>
                  <td className="py-3 px-4">101 - 106</td>
                  <td className="py-3 px-4">81 - 86</td>
                  <td className="py-3 px-4">109 - 114</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 14</td>
                </tr>
                <tr className="hover:bg-[#FAF8F5]/50 bg-[#FAF8F5]/20">
                  <td className="py-3 px-4 font-bold text-[#C6A77D]">XXL (16)</td>
                  <td className="py-3 px-4">107 - 112</td>
                  <td className="py-3 px-4">87 - 92</td>
                  <td className="py-3 px-4">115 - 120</td>
                  <td className="py-3 px-4 text-[#77716C]">Talla 16</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* How to Measure Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA]">
              <span className="font-semibold text-xs text-[#171717] block mb-1">
                1. Busto
              </span>
              <p className="text-[11px] text-[#77716C]">
                Mide alrededor de la parte más prominente del pecho, manteniendo la cinta recta en la espalda.
              </p>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA]">
              <span className="font-semibold text-xs text-[#171717] block mb-1">
                2. Cintura
              </span>
              <p className="text-[11px] text-[#77716C]">
                Mide en el punto más estrecho del torso, aproximadamente 2 cm por encima del ombligo.
              </p>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA]">
              <span className="font-semibold text-xs text-[#171717] block mb-1">
                3. Cadera
              </span>
              <p className="text-[11px] text-[#77716C]">
                Mide con los pies juntos alrededor de la parte más llena de tus glúteos.
              </p>
            </div>
          </div>

          {/* WhatsApp Tailoring Tip */}
          <div className="p-4 bg-[#F8F5F0] rounded-xl border border-[#C6A77D]/40 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#C6A77D] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-[#171717] block">
                ¿Tienes dudas entre dos tallas o deseas ajuste a la medida?
              </span>
              <p className="text-[#77716C] mt-0.5">
                Al finalizar tu pedido por WhatsApp, nuestra asesora te orientará con tus medidas en centímetros para garantizar un entalle perfecto.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#EDE4DA] flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
