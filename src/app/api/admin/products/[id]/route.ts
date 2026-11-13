import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { productUpsertSchema } from '@/lib/validators/schemas';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const parsed = productUpsertSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const { imageUrl, ...data } = parsed.data;
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { ...data, images: { deleteMany: {}, create: { url: imageUrl, altText: `${data.name} - Yasithma Products`, isPrimary: true } } },
    });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    return NextResponse.json({ error: 'Could not update product. Check that SKU and slug are unique.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    return NextResponse.json({ error: 'This product is referenced by an order. Archive it instead.' }, { status: 409 });
  }
}
