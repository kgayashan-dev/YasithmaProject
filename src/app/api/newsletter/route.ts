import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ email: z.string().email('Please enter a valid email address') });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { isSubscribed: true },
      create: { email: parsed.data.email },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
