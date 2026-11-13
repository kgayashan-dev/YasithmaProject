import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayHereWebhookSignature } from '@/lib/payments/provider';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const merchantId = String(formData.get('merchant_id') || '');
    const orderId = String(formData.get('order_id') || '');
    const payhereAmount = String(formData.get('payhere_amount') || '');
    const payhereCurrency = String(formData.get('payhere_currency') || '');
    const statusCode = String(formData.get('status_code') || '');
    const md5sig = String(formData.get('md5sig') || '');
    const paymentId = String(formData.get('payment_id') || '');

    const isValid = verifyPayHereWebhookSignature({
      merchantId,
      orderId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      md5sig,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    if (statusCode === '2') {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
          where: { orderNumber: orderId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        });
        await tx.payment.update({
          where: { orderId: order.id },
          data: {
            status: 'PAID',
            providerRef: paymentId,
            verifiedAt: new Date(),
          },
        });
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
