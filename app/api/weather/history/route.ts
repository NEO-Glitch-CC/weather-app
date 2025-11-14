import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const weatherHistory = await prisma.weather.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(weatherHistory);
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather history' },
      { status: 500 }
    );
  }
}
