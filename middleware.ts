import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { verifyAdminSessionCookie, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export async function middleware(request: NextRequest) {
  // Interruptor temporal: mientras el sitio no sea público y sigas haciendo
  // ajustes, esto deja /dashboard y /admin abiertos sin login. Ponlo en
  // 'false' (o quítalo) antes de tener artistas/clientes reales usando esto.
  if (process.env.DISABLE_AUTH === 'true') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminSessionCookie(cookie);
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const { response, user } = await updateSession(request);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
