import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  User,
  Phone,
  Home,
  FileText,
  AlertCircle,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  formatCOP,
  generateWhatsAppOrderText,
  generateWhatsAppOrderUrl,
  COLOMBIA_DEPARTMENTS
} from '../utils/formatters';

export const WhatsAppCheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    customerInfo,
    setCustomerInfo,
    storeSettings,
    showNotification,
  } = useStore();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<'form' | 'preview'>('form');

  if (!isCheckoutModalOpen) return null;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customerInfo.fullName.trim()) {
      errors.fullName = 'Por favor ingresa tu nombre completo.';
    }
    if (!customerInfo.phone.trim() || customerInfo.phone.trim().length < 7) {
      errors.phone = 'Por favor ingresa un número de celular válido para coordinar la entrega.';
    }
    if (!customerInfo.city.trim()) {
      errors.city = 'Por favor indica la ciudad de entrega.';
    }
    if (!customerInfo.address.trim()) {
      errors.address = 'Por favor ingresa tu dirección o lugar de recepción.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenWhatsApp = () => {
    if (!validateForm()) {
      setActiveStep('form');
      return;
    }

    if (cart.length === 0) {
      showNotification('Tu bolsa está vacía. Selecciona al menos una prenda.');
      return;
    }

    const whatsappUrl = generateWhatsAppOrderUrl(
      cart,
      customerInfo,
      storeSettings.whatsappNumber,
      storeSettings.brandName
    );

    // Open WhatsApp in new tab/app without wiping cart
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showNotification('Redirigiendo a WhatsApp con tu pedido...');
  };

  const handleCopySummary = () => {
    if (!validateForm()) {
      setActiveStep('form');
      return;
    }

    const orderText = generateWhatsAppOrderText(
      cart,
      customerInfo,
      storeSettings.brandName
    );

    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderText);
      setCopied(true);
      showNotification('¡Resumen de pedido copiado! Puedes pegarlo en WhatsApp.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const orderTextPreview = generateWhatsAppOrderText(
    cart,
    customerInfo,
    storeSettings.brandName
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setIsCheckoutModalOpen(false)}
    >
      <div
        className="bg-white sm:rounded-2xl max-w-2xl w-full min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto shadow-2xl border-0 sm:border border-[#EDE4DA] sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#EDE4DA] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#171717]">
                Finalizar Pedido por WhatsApp
              </h2>
              <p className="text-xs text-[#77716C]">
                Línea oficial: <strong>{storeSettings.whatsappDisplay}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-[#77716C] hover:text-[#171717] rounded-full hover:bg-[#FAF8F5] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Toggles: Datos de Entrega vs Vista Previa */}
        <div className="flex border-b border-[#EDE4DA] bg-[#FAF8F5] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveStep('form')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeStep === 'form'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <span>1. Datos de Envío & Entrega</span>
          </button>
          <button
            onClick={() => setActiveStep('preview')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeStep === 'preview'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <span>2. Mensaje para WhatsApp ({cart.length} prendas)</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeStep === 'form' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] text-xs text-[#77716C] leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C6A77D] shrink-0 mt-0.5" />
                <p>
                  No requerimos tarjeta de crédito en este paso. Tus datos se utilizan únicamente para calcular el despacho y preparar el mensaje que enviarás a nuestra asesora por WhatsApp.
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#77716C] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Ej. Carolina Gómez"
                      className={`w-full pl-9 pr-3 py-2.5 text-base sm:text-xs bg-white border rounded-lg focus:outline-hidden transition-colors ${
                        formErrors.fullName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#EDE4DA] focus:border-[#C6A77D]'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <span className="text-[11px] text-red-600 mt-1 block">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                {/* Celular / WhatsApp */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Número de Celular / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#77716C] absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Ej. 310 123 4567"
                      className={`w-full pl-9 pr-3 py-2.5 text-base sm:text-xs bg-white border rounded-lg focus:outline-hidden transition-colors ${
                        formErrors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#EDE4DA] focus:border-[#C6A77D]'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-600 mt-1 block">
                      {formErrors.phone}
                    </span>
                  )}
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Departamento *
                  </label>
                  <select
                    value={customerInfo.department}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, department: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 text-base sm:text-xs bg-white border border-[#EDE4DA] rounded-lg focus:outline-hidden focus:border-[#C6A77D]"
                  >
                    {COLOMBIA_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Ciudad o Municipio *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#77716C] absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, city: e.target.value }))
                      }
                      placeholder="Ej. Bogotá, Medellín, Neiva..."
                      className={`w-full pl-9 pr-3 py-2.5 text-base sm:text-xs bg-white border rounded-lg focus:outline-hidden transition-colors ${
                        formErrors.city
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#EDE4DA] focus:border-[#C6A77D]'
                      }`}
                    />
                  </div>
                  {formErrors.city && (
                    <span className="text-[11px] text-red-600 mt-1 block">
                      {formErrors.city}
                    </span>
                  )}
                </div>

                {/* Dirección */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Dirección de entrega *
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-[#77716C] absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="Ej. Carrera 15 # 85 - 20, Apto 402"
                      className={`w-full pl-9 pr-3 py-2.5 text-base sm:text-xs bg-white border rounded-lg focus:outline-hidden transition-colors ${
                        formErrors.address
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#EDE4DA] focus:border-[#C6A77D]'
                      }`}
                    />
                  </div>
                  {formErrors.address && (
                    <span className="text-[11px] text-red-600 mt-1 block">
                      {formErrors.address}
                    </span>
                  )}
                </div>

                {/* Barrio o referencia */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Barrio / Conjunto / Referencia
                  </label>
                  <input
                    type="text"
                    value={customerInfo.neighborhood}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, neighborhood: e.target.value }))
                    }
                    placeholder="Ej. Chicó Norte / Cerca al parque"
                    className="w-full px-3 py-2.5 text-base sm:text-xs bg-white border border-[#EDE4DA] rounded-lg focus:outline-hidden focus:border-[#C6A77D]"
                  />
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Observaciones o requerimiento de talla
                  </label>
                  <input
                    type="text"
                    value={customerInfo.observations}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, observations: e.target.value }))
                    }
                    placeholder="Ej. Consultar ajuste de ruedo / Fecha límite evento"
                    className="w-full px-3 py-2.5 text-base sm:text-xs bg-white border border-[#EDE4DA] rounded-lg focus:outline-hidden focus:border-[#C6A77D]"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Live Message Preview */
            <div className="space-y-4">
              <div className="text-xs text-[#77716C]">
                Este es el mensaje exacto que se cargará automáticamente en tu WhatsApp para ser atendida por la boutique:
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE4DA] font-mono text-xs whitespace-pre-wrap text-[#171717] max-h-72 overflow-y-auto leading-relaxed shadow-inner">
                {orderTextPreview}
              </div>
            </div>
          )}

          {/* Mini Summary of Cart Items */}
          <div className="p-4 bg-[#F8F5F0] rounded-xl border border-[#EDE4DA] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#77716C] block">
                Total de prendas ({cart.reduce((s, i) => s + i.quantity, 0)} unidades):
              </span>
              <span className="font-serif text-lg font-bold text-[#171717] tabular-nums">
                {formatCOP(cartTotal)}
              </span>
            </div>

            <span className="text-[11px] text-[#77716C] text-right">
              Disponibilidad y flete se<br />confirman en el chat
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Enviar Pedido a WhatsApp ({storeSettings.whatsappDisplay})</span>
              <ExternalLink className="w-4 h-4 text-white/80 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={handleCopySummary}
              className="w-full py-2.5 bg-white hover:bg-[#FAF8F5] text-[#171717] border border-[#EDE4DA] hover:border-[#171717] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado con éxito!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#77716C]" />
                  <span>Copiar resumen como texto alternativo</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-[#77716C]">
            * Al enviar el pedido no se descuenta ningún dinero automáticamente. La boutique te confirmará disponibilidad y medios de pago (Transferencia Bancolombia, Nequi o Daviplata).
          </p>
        </div>
      </div>
    </div>
  );
};
