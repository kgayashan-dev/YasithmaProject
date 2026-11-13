import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-forest">Orders & Fulfillment</h1>
        <p className="text-xs text-botanicalText/70 mt-1">
          Review customer delivery details, payment statuses, and ordered items.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-ivory-light p-6 rounded-2xl border border-sage/20 space-y-3 text-xs"
          >
            <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-sage/15">
              <div>
                <span className="font-bold text-forest text-sm">{ord.orderNumber}</span>
                <span className="ml-3 text-botanicalText/70">
                  {new Date(ord.createdAt).toLocaleString('en-LK')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-forest text-ivory font-semibold">
                  {ord.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-gold/25 text-forest font-semibold">
                  {ord.paymentMethod}: {ord.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-forest">Customer & Delivery:</p>
                <p>{ord.customerName} • {ord.customerPhone}</p>
                <p>{ord.shippingAddress}, {ord.city}, {ord.district}</p>
              </div>
              <div>
                <p className="font-semibold text-forest">Items:</p>
                {ord.items.map((item) => (
                  <p key={item.id}>
                    {item.productNameSnap} ({item.netWeightSnap}) × {item.quantity} — LKR{' '}
                    {Number(item.lineTotalLkr).toFixed(2)}
                  </p>
                ))}
                <p className="font-bold text-forest mt-1">
                  Total: LKR {Number(ord.totalLkr).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
