import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // require auth cookie and return only favorites for the logged-in user
    const cookie = request.cookies.get('auth')?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(cookie);
    if (!payload || !(payload as any).id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = String((payload as any).id);
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth')?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(cookie);
    if (!payload || !(payload as any).id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { city, country, latitude, longitude } = body;
    if (!city || latitude == null || longitude == null) {
      return NextResponse.json({ error: 'city, latitude, longitude required' }, { status: 400 });
    }

    const userId = String((payload as any).id);
    const fav = await prisma.favorite.create({
      data: {
        userId,
        city,
        country: country || undefined,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    return NextResponse.json(fav);
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth')?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(cookie);
    if (!payload || !(payload as any).id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const userId = String((payload as any).id);
    // ensure favorite belongs to the user
    const fav = await prisma.favorite.findUnique({ where: { id } });
    if (!fav || fav.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.favorite.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
