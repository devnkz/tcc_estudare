import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  { path: "/Auth/Login", whenAuthenticated: "redirect" },
  { path: "/Auth/Register", whenAuthenticated: "redirect" },
  { path: "/about", whenAuthenticated: "next" },
  { path: "/", whenAuthenticated: "next" }
] as const;

const REDIRECT_NOT_AUTENTICATED_ROUTE = "/Auth/Login";

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get("token");

  // Sem token e rota pública → continua
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Sem token e rota privada → redireciona
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_NOT_AUTENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Com token e rota pública que redireciona quando logado
  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/home";
    return NextResponse.redirect(redirectUrl);
  }

  // Com token e rota privada → verificar expiração
  if (authToken && !publicRoute) {
    function isTokenExpired(token: string): boolean {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      } catch {
        return true;
      }
    }

    if (isTokenExpired(authToken.value)) {
      // Criar resposta de redirecionamento
      const redirectUrl = new URL(REDIRECT_NOT_AUTENTICATED_ROUTE, request.url);
      const response = NextResponse.redirect(redirectUrl);

      // Remover o cookie
      response.cookies.set("token", "", {
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
Match all request paths except for os que começam com:
api (API routes)
_next/static (static files)
_next/image (image optimization files)
favicon.ico (favicon file)
arquivos png e svg
*/
    '/((?!api|_next/static|_next/image|favicon.ico|.\.png|.\.svg).*)',
  ],
}
