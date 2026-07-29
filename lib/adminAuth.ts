const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const ADMIN_COOKIE_NAME = 'admin_session';

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.ADMIN_PASSWORD || ''),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createAdminSessionCookie(): Promise<string> {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const payload = `admin-session:${expiry}`;
  return `${expiry}.${await sign(payload)}`;
}

export async function verifyAdminSessionCookie(cookie: string | undefined): Promise<boolean> {
  if (!cookie) return false;
  const [expiryStr, signature] = cookie.split('.');
  const expiry = Number(expiryStr);
  if (!expiry || Date.now() > expiry) return false;
  const expected = await sign(`admin-session:${expiry}`);
  return signature === expected;
}
