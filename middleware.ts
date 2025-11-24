import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { MiddlewareConfig } from "next/server";
import { ADMIN_EMAILS } from "@/lib/roles";

// Rotas públicas e comportamento quando autenticado
const publicRoutes = [
  { path: "/Auth/Login", whenAuthenticated: "redirect" },
  { path: "/Auth/Register", whenAuthenticated: "redirect" },
  { path: "/about", whenAuthenticated: "next" },
  { path: "/", whenAuthenticated: "next" }
] as const;

const REDIRECT_NOT_AUTHENTICATED = "/Auth/Login";

// Rotas que exigem autenticação explícita
const protectedPaths = [
  "/home",
  "/dashboard",
  "/user",
  "/notifications",
  "/groups",
  "/askQuestion",
  "/Auth/Me"
];

// Determina se a rota é protegida
function isProtected(pathname: string) {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/Auth") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return false;
  }
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// JWT expiração
function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const publicRoute = publicRoutes.find(r => r.path === path);
  const token = req.cookies.get("token");

  // 🔓 1. Se rota pública e sem token → segue
  if (!token && publicRoute) {
    return NextResponse.next();
  }

  // 🔐 2. Se rota privada e sem token → redireciona para login
  if (!token && !publicRoute && isProtected(path)) {
    const url = req.nextUrl.clone();
    url.pathname = REDIRECT_NOT_AUTHENTICATED;
    return NextResponse.redirect(url);
  }

  // 🔁 3. Se autenticado e rota pública que exige redirect → manda pra /home
  if (token && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // 🔐 4. Token presente nas rotas protegidas → validar expiração
  if (token && isProtected(path)) {
    if (isTokenExpired(token.value)) {
      const url = req.nextUrl.clone();
      url.pathname = REDIRECT_NOT_AUTHENTICATED;
      const res = NextResponse.redirect(url);
      res.cookies.set("token", "", { maxAge: -1 });
      return res;
    }

    // 👑 5. Autorização de admin para /dashboard
    if (path.startsWith("/dashboard")) {
      try {
        const data: any = jwtDecode(token.value);
        const role = (data?.tipo_usuario || "").toLowerCase();
        const email = (data?.email_usuario || "").toLowerCase();

        const isAdmin =
          role === "admin" ||
          role === "administrador" ||
          ADMIN_EMAILS.includes(email);

        if (!isAdmin) {
          const url = req.nextUrl.clone();
          url.pathname = "/home";
          return NextResponse.redirect(url);
        }
      } catch (e) {
        // token mal formado → desaloga
        const url = req.nextUrl.clone();
        url.pathname = REDIRECT_NOT_AUTHENTICATED;
        const res = NextResponse.redirect(url);
        res.cookies.set("token", "", { maxAge: -1 });
        return res;
      }
    }
  }

  // ✔️ Se passou por tudo → segue request normal
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"
  ]
};
