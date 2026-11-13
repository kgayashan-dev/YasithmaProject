import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; pm?: string };
}) {
  const order = searchParams.order
    ? await prisma.order
        .findUnique({
          where: { orderNumber: searchParams.order },
          include: { items: true },
        })
        .catch(() => null)
    : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-ivory-light rounded-3xl border border-sage/25 p-8 sm:p-10 shadow-botanical text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-forest">
          Thank You for Your Order!
        </h1>

        {order ? (
          <>
            <p className="text-sm text-botanicalText/80">
              Your order <strong>{order.orderNumber}</strong> has been recorded with status{' '}
              <span className="font-semibold text-forest">{order.status}</span>.
            </p>

            <div className="bg-ivory rounded-2xl p-5 border border-sage/20 text-left text-xs space-y-2">
              <p>
                <strong>Customer:</strong> {order.customerName} ({order.customerPhone})
              </p>
              <p>
                <strong>Delivery Address:</strong> {order.shippingAddress}, {order.city},{' '}
                {order.district}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
              </p>
              <p className="text-sm font-bold text-forest pt-2 border-t border-sage/15">
                Total Amount: LKR{' '}
                {Number(order.totalLkr).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {order.paymentMethod === 'BANK_TRANSFER' && (
              <div className="bg-gold/15 border border-gold rounded-2xl p-4 text-left text-xs space-y-1">
                <p className="font-semibold text-forest">Bank Transfer Instructions:</p>
                <p>
                  Please transfer the total amount using your Order Number{' '}
                  <strong>{order.orderNumber}</strong> as the reference and share the receipt on
                  WhatsApp (076 764 4654).
                </p>
              </div>
            )}

            {order.paymentMethod === 'PAYHERE' && (
              <div className="bg-terracotta/10 border border-terracotta/30 rounded-2xl p-4 text-left text-xs">
                <p className="font-semibold text-terracotta">Online Payment Notice:</p>
                <p>
                  PayHere merchant gateway credentials are not yet active in this environment. No
                  online charge has been processed. You may complete payment via Bank Transfer or
                  WhatsApp confirmation.
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-botanicalText/80">
            Your order reference has been logged. Contact us on WhatsApp if you need assistance.
          </p>
        )}

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/94767644654?text=${encodeURIComponent(
              `Hello Yasithma Products, I just placed order ${searchParams.order || ''}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-forest text-ivory px-6 py-3 rounded-full text-xs font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            Confirm on WhatsApp
          </a>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-forest/30 text-forest px-6 py-3 rounded-full text-xs font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
