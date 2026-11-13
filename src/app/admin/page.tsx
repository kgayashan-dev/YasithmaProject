import React from 'react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [totalOrders, pendingOrders, products, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.findMany({ orderBy: { stockQuantity: 'asc' } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const paidOrders = await prisma.order.findMany({
    where: { status: { not: 'CANCELLED' } },
    select: { totalLkr: true },
  });
  const revenue = paidOrders.reduce((acc, o) => acc + Number(o.totalLkr), 0);
  const lowStock = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-forest">Dashboard Overview</h1>
        <p className="text-xs text-botanicalText/70 mt-1">
          Real-time inventory, orders, and store metrics for Yasithma Products.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-ivory-light p-6 rounded-2xl border border-sage/20">
          <p className="text-xs text-sage font-semibold">Gross Order Volume</p>
          <p className="font-serif text-2xl font-bold text-forest mt-1">
            LKR {revenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-ivory-light p-6 rounded-2xl border border-sage/20">
          <p className="text-xs text-sage font-semibold">Total Orders</p>
          <p className="font-serif text-2xl font-bold text-forest mt-1">{totalOrders}</p>
        </div>
        <div className="bg-ivory-light p-6 rounded-2xl border border-sage/20">
          <p className="text-xs text-terracotta font-semibold">Pending Orders</p>
          <p className="font-serif text-2xl font-bold text-terracotta mt-1">{pendingOrders}</p>
        </div>
        <div className="bg-ivory-light p-6 rounded-2xl border border-sage/20">
          <p className="text-xs text-sage font-semibold">Active SKUs</p>
          <p className="font-serif text-2xl font-bold text-forest mt-1">{products.length}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-terracotta/10 border border-terracotta/30 rounded-2xl p-5">
          <h2 className="font-serif text-lg font-semibold text-terracotta mb-2">
            Low Stock Alerts
          </h2>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((item) => (
              <span
                key={item.id}
                className="bg-white text-terracotta text-xs font-semibold px-3 py-1.5 rounded-full border border-terracotta/20"
              >
                {item.name}: {item.stockQuantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-ivory-light rounded-2xl border border-sage/20 overflow-hidden">
        <div className="p-5 border-b border-sage/20">
          <h2 className="font-serif text-lg font-semibold text-forest">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sage-soft/50 text-forest uppercase">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">District</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/15">
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td className="p-4 font-bold text-forest">{ord.orderNumber}</td>
                  <td className="p-4">{ord.customerName}</td>
                  <td className="p-4">{ord.district}</td>
                  <td className="p-4">{ord.paymentMethod} ({ord.paymentStatus})</td>
                  <td className="p-4 font-semibold">{ord.status}</td>
                  <td className="p-4 font-bold">
                    {Number(ord.totalLkr).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
