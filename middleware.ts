import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { verifyAdminSessionCookie, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

// Local development escape hatch: skips the login redirect so the dashboard
// can be worked on without seeding an auth user. Deliberately inert in
// production — a misconfigured environment variable must never be enough to
// expose /admin.
const AUTH_DISABLED =
  process.env.DISABLE_AUTH === 'true' && process.env.NODE_ENV !== 'production';

export async function middleware(request: NextRequest) {
  if (AUTH_DISABLED) {
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
