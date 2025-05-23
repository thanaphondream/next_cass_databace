// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const protectedPaths = ['/Home', '/About'];
  const currentPath = request.nextUrl.pathname;

  const isProtected = protectedPaths.includes(currentPath);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// ป้องกันเฉพาะ path เหล่านี้
export const config = {
  matcher: ['/Home', '/About'],
};
