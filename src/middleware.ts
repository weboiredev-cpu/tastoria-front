import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAuthPath = request.nextUrl.pathname === '/admin/signin';
  const isQRScan = request.nextUrl.searchParams.has('qr');

  // Handle QR code scan redirections
  if (isQRScan) {
    return NextResponse.redirect(new URL('/order-options', request.url));
  }

  // Redirect to sign in if accessing admin routes without auth
  if (isAdminPath && !isAuthPath && !token) {
    return NextResponse.redirect(new URL('/admin/signin', request.url));
  }

  // Redirect to dashboard if already authenticated and trying to access sign in
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 