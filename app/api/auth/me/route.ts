import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth')?.value;
    if (!cookie) return NextResponse.json({ user: null });

    const payload = verifyToken(cookie);
    if (!payload || !payload.id) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({ where: { id: String((payload as any).id) } });
    return NextResponse.json({ user: user || null });
  } catch (error) {
    console.error('Me error', error);
    return NextResponse.json({ user: null });
  }
}
