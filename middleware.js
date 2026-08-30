export const config = {
  matcher: ['/((?!_vercel/insights|_vercel/speed-insights).*)'],
};

const encoder = new TextEncoder();

function safeEqual(a, b) {
  const x = String(a || '');
  const y = String(b || '');
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

async function sessionValue(user, password) {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`acf-v36:${user.toLowerCase()}`));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function cookieValue(request, name) {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function loginPage(error = '') {
  const errorHtml = error ? `<div class="error">${error}</div>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b2f5b"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="ACF Quoting"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=36"><link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=36"><link rel="manifest" href="/manifest.webmanifest?v=36"><title>ACF Engineer Login</title>
<style>
:root{--navy:#0b2f5b;--red:#ed1c2e;--bg:#eef3f8;--text:#10243b;--muted:#66788b;--line:#d5e0eb}*{box-sizing:border-box}body{margin:0;min-height:100svh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:linear-gradient(180deg,#fff 0,#eef3f8 48%,#e7eef6 100%);color:var(--text);display:flex;align-items:center;justify-content:center;padding:24px;padding-top:max(24px,env(safe-area-inset-top));padding-bottom:max(24px,env(safe-area-inset-bottom))}.login{width:min(100%,420px);background:#fff;border:1px solid var(--line);border-radius:24px;padding:28px 24px 24px;box-shadow:0 10px 35px rgba(11,47,91,.12);text-align:center}.logo{width:112px;height:112px;object-fit:contain;margin:0 auto 10px;display:block}.eyebrow{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--red);margin-bottom:5px}h1{margin:0;color:var(--navy);font-size:25px;line-height:1.15}p{margin:8px 0 22px;color:var(--muted);font-size:13px;line-height:1.45}.field{text-align:left;margin:13px 0}.field label{display:block;font-size:13px;font-weight:800;color:var(--navy);margin-bottom:6px}.field input{width:100%;padding:14px 13px;border:1px solid #c7d5e2;border-radius:11px;background:#fff;color:var(--text);font:inherit;font-size:16px;outline:none}.field input:focus{border-color:#4779aa;box-shadow:0 0 0 3px rgba(71,121,170,.12)}button{width:100%;border:0;border-radius:11px;background:var(--red);color:#fff;padding:14px;margin-top:8px;font-weight:800;font-size:16px;font-family:inherit}.error{background:#fff0f1;color:#a51420;border:1px solid #f2c6ca;border-radius:10px;padding:10px;margin:0 0 12px;font-size:13px;font-weight:700}.secure{margin-top:16px;color:#8190a0;font-size:11px}.version{margin-top:5px;color:#9aa6b3;font-size:10px}
</style></head><body><main class="login"><img class="logo" src="/acf-boiler-pricing-logo.png" alt="ACF Services Ltd"><div class="eyebrow">ACF Services Ltd</div><h1>Engineer Login</h1><p>Secure access to ACF Boiler Pricing and engineer tools.</p>${errorHtml}<form method="post" action="/login"><div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" inputmode="email" required></div><div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></div><button type="submit">Sign In</button></form><div class="secure">🔒 Authorised ACF engineers only</div><div class="version">ACF engineer tools · v36</div></main></body></html>`;
}

export default async function middleware(request) {
  const users = [
    { email: process.env.ACF_ADMIN1_USER || process.env.ACF_APP_USER, password: process.env.ACF_ADMIN1_PASSWORD || process.env.ACF_APP_PASSWORD, role: 'admin' },
    { email: process.env.ACF_ADMIN2_USER, password: process.env.ACF_ADMIN2_PASSWORD, role: 'admin' },
    { email: process.env.ACF_QUOTER1_USER, password: process.env.ACF_QUOTER1_PASSWORD, role: 'quoter' },
    { email: process.env.ACF_QUOTER2_USER, password: process.env.ACF_QUOTER2_PASSWORD, role: 'quoter' },
  ].filter(u => u.email && u.password);
  if (!users.length) return new Response('ACF app access has not been configured yet.', { status: 503 });

  const url = new URL(request.url);
  if (url.pathname === '/acf-boiler-pricing-logo.png' || url.pathname === '/apple-touch-icon.png' || url.pathname === '/icon-192.png' || url.pathname === '/icon-512.png') return;

  let authenticatedUser = null;
  const currentSession = cookieValue(request, 'acf_session');
  for (const u of users) {
    const token = await sessionValue(u.email, u.password);
    if (safeEqual(currentSession, token)) { authenticatedUser = { ...u, token }; break; }
  }
  const authenticated = !!authenticatedUser;

  if (url.pathname === '/login') {
    if (request.method === 'POST') {
      let form;
      try { form = await request.formData(); } catch (_) { form = null; }
      const user = form ? String(form.get('email') || '').trim() : '';
      const password = form ? String(form.get('password') || '') : '';
      const match = users.find(u => safeEqual(user.toLowerCase(), u.email.toLowerCase()) && safeEqual(password, u.password));
      if (match) {
        const token = await sessionValue(match.email, match.password);
        return new Response(null, { status: 303, headers: {
          'Location': '/',
          'Set-Cookie': `acf_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000, acf_role=${match.role}; Path=/; Secure; SameSite=Strict; Max-Age=2592000, acf_user=${encodeURIComponent(match.email)}; Path=/; Secure; SameSite=Strict; Max-Age=2592000`,
          'Cache-Control': 'no-store'
        }});
      }
      return new Response(loginPage('Email or password is incorrect.'), { status: 401, headers: { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store' }});
    }
    if (authenticated) return new Response(null, { status: 303, headers: { 'Location':'/' } });
    return new Response(loginPage(), { status: 200, headers: { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store' }});
  }

  if (!authenticated) return new Response(null, { status: 303, headers: { 'Location':'/login', 'Cache-Control':'no-store' } });
  return;
}
