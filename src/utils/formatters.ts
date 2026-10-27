import { CartItem, CustomerOrderInfo } from '../types';

/**
 * Formats a numeric price into Colombian Pesos notation: "$120.000 COP"
 */
export function formatCOP(amount: number): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `$${formatted} COP`;
}

/**
 * Calculates discount percentage
 */
export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Generates the structured WhatsApp order text matching official boutique formatting
 */
export function generateWhatsAppOrderText(
  cart: CartItem[],
  info: CustomerOrderInfo,
  brandName: string = 'CIRLENI HERNÁNDEZ'
): string {
  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const itemsList = cart
    .map((item, index) => {
      const priceText =
        item.quantity > 1
          ? `💰 *Precio unitario:* ${formatCOP(item.unitPrice)}\n💵 *Subtotal:* ${formatCOP(
              item.unitPrice * item.quantity
            )}`
          : `💰 *Precio:* ${formatCOP(item.unitPrice)}`;

      return `👗 *Producto ${index + 1}:* ${item.product.name}
🎨 *Color:* ${item.selectedColor.name}
🔢 *Cantidad:* ${item.quantity}
${priceText}`;
    })
    .join('\n\n');

  const locationLine = info.department
    ? `${info.city}, ${info.department}`
    : info.city;

  const obsLine = info.observations
    ? `\n📝 *Observaciones:* ${info.observations}`
    : '';

  const refLine = info.neighborhood
    ? `\n🏘️ *Barrio / Referencia:* ${info.neighborhood}`
    : '';

  return `🛍️ *NUEVO PEDIDO — ${brandName.toUpperCase()}*

Hola, quiero realizar el siguiente pedido:

${itemsList}

━━━━━━━━━━━━
🛒 *TOTAL DEL PEDIDO:* ${formatCOP(total)}
━━━━━━━━━━━━

👤 *Nombre:* ${info.fullName}
📱 *Celular:* ${info.phone}
📍 *Ciudad:* ${locationLine}
🏠 *Dirección:* ${info.address}${refLine}${obsLine}

✨ Quedo atenta a la confirmación de disponibilidad, envío y forma de pago.`;
}

/**
 * Generates the direct WhatsApp click-to-chat URL
 */
export function generateWhatsAppOrderUrl(
  cart: CartItem[],
  info: CustomerOrderInfo,
  whatsappNumber: string,
  brandName: string = 'CIRLENI HERNÁNDEZ'
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const message = generateWhatsAppOrderText(cart, info, brandName);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Departments of Colombia for shipping form
 */
export const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];
