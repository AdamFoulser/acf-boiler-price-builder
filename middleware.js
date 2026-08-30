export const config = {
  matcher: ['/((?!_vercel/insights|_vercel/speed-insights).*)'],
};

export default function middleware(request) {
  const expectedUser = process.env.ACF_APP_USER;
  const expectedPassword = process.env.ACF_APP_PASSWORD;

  // Fail closed if credentials have not been configured in Vercel.
  if (!expectedUser || !expectedPassword) {
    return new Response('ACF app access has not been configured yet.', { status: 503 });
  }

  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const splitAt = decoded.indexOf(':');
      const user = decoded.slice(0, splitAt);
      const password = decoded.slice(splitAt + 1);
      if (user.toLowerCase() === expectedUser.toLowerCase() && password === expectedPassword) {
        return;
      }
    } catch (_) {}
  }

  return new Response('ACF Services Ltd — authorised access only.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="ACF Engineer App", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
