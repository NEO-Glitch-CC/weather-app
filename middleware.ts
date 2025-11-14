import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes yang tidak memerlukan authentikasi
  const publicRoutes = ['/', '/api/weather', '/api/geocoding'];

  // Jika mengakses public routes, lanjutkan
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Untuk routes yang memerlukan auth, bisa ditambahkan logika authentikasi
  // Contoh: cek token dari cookies atau headers
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
