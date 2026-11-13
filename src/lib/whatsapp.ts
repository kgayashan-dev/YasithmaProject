export interface WhatsAppOrderItem {
  name: string;
  netWeight: string;
  quantity: number;
  priceLkr: number;
}

export function buildWhatsAppOrderUrl(params: {
  whatsappNumber?: string;
  items: WhatsAppOrderItem[];
  subtotalLkr: number;
  deliveryFeeLkr: number;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
  };
}): string {
  const phone = (params.whatsappNumber || '94767644654').replace(/[^0-9]/g, '');
  const total = params.subtotalLkr + params.deliveryFeeLkr;

  const lines: string[] = [
    '*New Order Inquiry — Yasithma Products*',
    '-----------------------------------',
    ...params.items.map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.netWeight}) x ${item.quantity} = LKR ${(
          item.priceLkr * item.quantity
        ).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`
    ),
    '-----------------------------------',
    `Subtotal: LKR ${params.subtotalLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`,
    `Delivery: ${
      params.deliveryFeeLkr === 0
        ? 'FREE'
        : `LKR ${params.deliveryFeeLkr.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`
    }`,
    `*Estimated Total: LKR ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}*`,
  ];

  if (params.customer?.name || params.customer?.address) {
    lines.push('', '*Delivery Details:*');
    if (params.customer.name) lines.push(`Name: ${params.customer.name}`);
    if (params.customer.phone) lines.push(`Mobile: ${params.customer.phone}`);
    if (params.customer.address) lines.push(`Address: ${params.customer.address}`);
    if (params.customer.city || params.customer.district) {
      lines.push(
        `Location: ${[params.customer.city, params.customer.district].filter(Boolean).join(', ')}`
      );
    }
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
