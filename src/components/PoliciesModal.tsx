import React, { useState } from 'react';
import { X, HelpCircle, Truck, RotateCcw, ShieldCheck, Mail, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'envios' | 'cambios' | 'faq' | 'contacto' | 'privacidad';
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'envios',
}) => {
  const { storeSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'envios' | 'cambios' | 'faq' | 'contacto' | 'privacidad'>(
    initialTab
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EDE4DA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EDE4DA] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-serif text-lg font-bold text-[#171717]">
            Centro de Información & Políticas
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#77716C] hover:text-[#171717] rounded-full hover:bg-[#FAF8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-[#EDE4DA] bg-[#FAF8F5] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('envios')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'envios'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Envíos</span>
          </button>

          <button
            onClick={() => setActiveTab('cambios')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cambios'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cambios & Garantía</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Preguntas Frecuentes</span>
          </button>

          <button
            onClick={() => setActiveTab('contacto')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'contacto'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contacto</span>
          </button>

          <button
            onClick={() => setActiveTab('privacidad')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'privacidad'
                ? 'border-[#171717] text-[#171717]'
                : 'border-transparent text-[#77716C] hover:text-[#171717]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacidad</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-[#77716C] leading-relaxed space-y-4">
          {activeTab === 'envios' && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Información de Envíos Nacionales
              </h3>
              <p>
                Despachamos desde Colombia a todas las ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga, Cartagena, Neiva y municipios aledaños) a través de transportadoras aliadas certificadas como Servientrega, Coordinadora e Interrapidísimo.
              </p>
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4DA] space-y-1 text-[#171717]">
                <p><strong>Tiempos de entrega habituales:</strong> 2 a 4 días hábiles en ciudades principales.</p>
                <p><strong>Confirmación de costo:</strong> El valor exacto del flete y tiempos se acuerdan directamente en el chat de WhatsApp al validar tu pedido.</p>
              </div>
            </div>
          )}

          {activeTab === 'cambios' && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Políticas de Cambios y Garantía
              </h3>
              <p>
                Queremos que te sientas absolutamente fascinada con tu prenda. Si la talla no fue la adecuada o deseas cambiar de color:
              </p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>Cuentas con hasta 15 días calendario a partir de la recepción para solicitar cambio por talla.</li>
                <li>La prenda debe encontrarse sin uso, sin perfumes, en su empaque original y con etiquetas intactas.</li>
                <li>Prendas en liquidación final o confecciones a medida personalizadas tienen condiciones especiales informadas previamente por la asesora.</li>
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Preguntas Frecuentes (FAQ)
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-[#171717]">
                  ¿Cómo se realiza el pago si no uso tarjeta aquí?
                </p>
                <p>
                  Al dar clic en "Finalizar pedido por WhatsApp", se abre el chat directo con nuestra boutique. Te enviaremos el número de cuenta Bancolombia, Nequi o Daviplata para tu transferencia segura.
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-[#EDE4DA]">
                <p className="font-semibold text-[#171717]">
                  ¿Puedo solicitar asesoría sobre mi talla exacta antes de enviar el paquete?
                </p>
                <p>
                  ¡Por supuesto! Nuestras estilistas te solicitarán tus medidas de busto, cintura y cadera en centímetros para verificar que la talla que escogiste te quede perfecta.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Canales de Atención Oficial
              </h3>
              <div className="space-y-2 text-[#171717]">
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp de Pedidos: <strong>{storeSettings.whatsappDisplay}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C6A77D]" />
                  <span>Instagram Oficial: <strong>@cirlenihernandez</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#77716C]" />
                  <span>Ubicación: Colombia</span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacidad' && (
            <div className="space-y-3">
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Políticas de Privacidad y Tratamiento de Datos
              </h3>
              <p>
                En Cirleni Hernández respetamos tu privacidad de conformidad con la Ley 1581 de 2012 de Colombia. La información de contacto y entrega que ingresas en esta tienda se utiliza única y exclusivamente para gestionar el despacho de tus compras y brindarte la mejor asesoría personalizada.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#EDE4DA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
