import { describe, it, expect } from 'vitest';
import { buildWhatsAppOrderUrl } from '../src/lib/whatsapp';
import { checkoutSchema } from '../src/lib/validators/schemas';

describe('Yasithma E-Commerce Core Utilities', () => {
  it('generates valid WhatsApp order link with LKR totals', () => {
    const url = buildWhatsAppOrderUrl({
      whatsappNumber: '94767644654',
      items: [
        { name: 'Blue Butterfly Flower Tea', netWeight: '50g', quantity: 2, priceLkr: 450 },
      ],
      subtotalLkr: 900,
      deliveryFeeLkr: 350,
    });
    expect(url).toContain('https://wa.me/94767644654?text=');
    expect(decodeURIComponent(url)).toContain('Blue Butterfly Flower Tea');
    expect(decodeURIComponent(url)).toContain('1,250.00');
  });

  it('validates Sri Lankan mobile phone format on checkout', () => {
    const valid = checkoutSchema.safeParse({
      customerName: 'Kavindu Perera',
      customerEmail: 'kavindu@example.com',
      customerPhone: '0767644654',
      shippingAddress: 'No. 48, Algama Road, Mahapitiya',
      city: 'Pothuhera',
      district: 'Kurunegala',
      paymentMethod: 'COD',
      idempotencyKey: 'YP-TEST-123456',
      items: [{ productId: 'prod_1', quantity: 1 }],
    });
    expect(valid.success).toBe(true);
  });
});
