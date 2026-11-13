import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validators/schemas';
import { getSession } from '@/lib/auth';
import { preparePayHereCheckout } from '@/lib/payments/provider';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid checkout input' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const session = await getSession();

    // Prevent duplicate order creation via idempotency key
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
    });
    if (existingOrder) {
      return NextResponse.json({ order: existingOrder });
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const standardDelivery = Number(settings?.standardDeliveryLkr ?? 350);
    const freeOver = Number(settings?.freeDeliveryOverLkr ?? 3500);

    // Transactional stock verification, price snapshot, and order creation
    const createdOrder = await prisma.$transaction(async (tx) => {
      const productIds = data.items.map((i) => i.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      let subtotal = 0;
      const orderItemsData = data.items.map((item) => {
        const product = dbProducts.find((p) => p.id === item.productId);
        if (!product || !product.isAvailable) {
          throw new Error(`Product unavailable: ${item.productId}`);
        }
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const unitPrice = Number(product.priceLkr);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        return {
          productId: product.id,
          productNameSnap: product.name,
          netWeightSnap: product.netWeight,
          unitPriceLkrSnap: unitPrice,
          quantity: item.quantity,
          lineTotalLkr: lineTotal,
        };
      });

      // Decrement inventory atomically
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      const deliveryFee = subtotal >= freeOver ? 0 : standardDelivery;
      const total = subtotal + deliveryFee;
      const orderNumber = `YP-${new Date().getFullYear()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      return tx.order.create({
        data: {
          orderNumber,
          userId: session?.userId || null,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          city: data.city,
          district: data.district,
          postalCode: data.postalCode || null,
          orderNotes: data.orderNotes || null,
          subtotalLkr: subtotal,
          deliveryFeeLkr: deliveryFee,
          totalLkr: total,
          paymentMethod: data.paymentMethod,
          paymentStatus:
            data.paymentMethod === 'BANK_TRANSFER' ? 'PENDING_VERIFICATION' : 'UNPAID',
          idempotencyKey: data.idempotencyKey,
          items: { create: orderItemsData },
          payment: {
            create: {
              provider: data.paymentMethod,
              amountLkr: total,
              status: 'UNPAID',
            },
          },
        },
      });
    });

    const paymentInit =
      data.paymentMethod === 'PAYHERE'
        ? preparePayHereCheckout({
            orderNumber: createdOrder.orderNumber,
            amountLkr: Number(createdOrder.totalLkr),
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            address: data.shippingAddress,
            city: data.city,
          })
        : null;

    return NextResponse.json({ order: createdOrder, paymentInit }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Order creation failed' },
      { status: 400 }
    );
  }
}
