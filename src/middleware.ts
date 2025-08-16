import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAuthPath = request.nextUrl.pathname === '/admin/signin';
  const isQRScan = request.nextUrl.searchParams.has('qr');

  // Handle QR code scan redirections
  if (isQRScan) {
    return NextResponse.redirect(new URL('/order-options', request.url));
  }

  // For admin routes, we'll let the client-side handle authentication
  // since we can't access localStorage in middleware
  // The client-side will redirect if no token is found
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 