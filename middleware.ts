import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista de prefixos de rota que precisam de autenticação
const protectedPaths = [
  "/home",
  "/dashboard",
  "/user",
  "/notifications",
  "/groups",
  "/askQuestion",
  "/Auth/Me", // exemplo
];

function isProtected(pathname: string) {
  // Não proteger arquivos estáticos, _next, api, e a rota Auth public
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/Auth") || pathname.startsWith("/static") || pathname.startsWith("/favicon.ico")) {
    return false;
  }

  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Decodifica o payload do JWT sem verificar assinatura (apenas para extrair o id)
function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return decoded as any;
  } catch (e) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = cookies.get('token')?.value;
  const loginUrl = new URL('/Auth/Login', req.url);

  if (!token) {
    // Sem token -> redirecionar para login
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);
  const userId = payload?.id;
  if (!userId) {
    // Token inválido -> limpar cookie e redirecionar
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set('token', '', { path: '/', maxAge: 0 });
    return res;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiUrl) {
      // Se não houver API configurada, permita seguir (ou você pode ajustar para falhar).
      return NextResponse.next();
    }

    const checkRes = await fetch(`${apiUrl.replace(/\/$/, '')}/user/${userId}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    if (checkRes.ok) {
      return NextResponse.next();
    }

    // Se o usuário não existe (404) ou server error (500) -> limpar token e redirecionar
    if (checkRes.status === 404 || checkRes.status === 500) {
      const res = NextResponse.redirect(loginUrl);
      res.cookies.set('token', '', { path: '/', maxAge: 0 });
      return res;
    }

    // Para outros códigos, permita seguir (ou mudar conforme necessidade)
    return NextResponse.next();
  } catch (e) {
    // Em caso de erro de rede ao consultar backend, limpar cookie e redirecionar
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set('token', '', { path: '/', maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: [
    '/home/:path*',
    '/dashboard/:path*',
    '/user/:path*',
    '/notifications/:path*',
    '/groups/:path*',
    '/askQuestion/:path*',
  ],
};
