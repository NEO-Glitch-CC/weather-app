import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    const where = userId ? { userId } : {};
    const favorites = await prisma.favorite.findMany({
      where,
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
    const body = await request.json();
    const { userId, city, country, latitude, longitude } = body;
    if (!city || latitude == null || longitude == null) {
      return NextResponse.json({ error: 'city, latitude, longitude required' }, { status: 400 });
    }

    const fav = await prisma.favorite.create({
      data: {
        userId: userId || undefined,
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await prisma.favorite.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
