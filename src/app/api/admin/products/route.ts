import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { productUpsertSchema } from '@/lib/validators/schemas';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = productUpsertSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const { imageUrl, ...data } = parsed.data;
    const product = await prisma.product.create({
      data: { ...data, images: { create: { url: imageUrl, altText: `${data.name} - Yasithma Products`, isPrimary: true } } },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    return NextResponse.json({ error: 'Could not create product. Check that SKU and slug are unique.' }, { status: 400 });
  }
}
