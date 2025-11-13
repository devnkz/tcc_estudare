# Correção: Acesso ao Dashboard por Tipo de Usuário

## 🎯 Problema Identificado

O sistema estava usando **valores hardcoded** e **emails específicos** para validar acesso ao dashboard, em vez de usar o `tipo_usuario` vindo do banco de dados.

### Valores Incorretos Encontrados:
- ❌ Verificando `role === "administrador"` (não existe no banco)
- ❌ Verificando `role === "adm"` (não existe no banco)
- ❌ Lista de emails hardcoded: `["lilvhx@gmail.com"]`
- ✅ Valor correto no banco: `"Admin"` (com A maiúsculo)

## ✅ Correções Aplicadas

### 1. Frontend - `tcc_estudare/src/lib/roles.ts`

**Antes:**
```typescript
export type UserRole = 'aluno' | 'professor' | 'administrador';

export const ROLE_POWER: Record<UserRole, number> = {
  aluno: 1,
  professor: 2,
  administrador: 3,
};

export function isAdmin(role?: string | null): boolean {
  return role?.toLowerCase() === 'administrador';
}

export const ADMIN_EMAILS: string[] = ['lilvhx@gmail.com'];
```

**Depois:**
```typescript
export type UserRole = 'Aluno' | 'Professor' | 'Admin';

export const ROLE_POWER: Record<UserRole, number> = {
  Aluno: 1,
  Professor: 2,
  Admin: 3,
};

export function isAdmin(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase();
  // Aceita "admin" ou "administrador" para compatibilidade
  return normalized === 'admin' || normalized === 'administrador';
}

// Lista vazia - verificação apenas por tipo_usuario
export const ADMIN_EMAILS: string[] = [];
```

### 2. Frontend - `tcc_estudare/src/middleware.ts`

**Antes:**
```typescript
if (path.startsWith("/dashboard")) {
    const role = (payload?.tipo_usuario || "").toLowerCase();
    const email = (payload?.email_usuario || "").toLowerCase();
    if (role !== "administrador" && !ADMIN_EMAILS.includes(email)) {
        // redirect
    }
}
```

**Depois:**
```typescript
if (path.startsWith("/dashboard")) {
    const role = (payload?.tipo_usuario || "").toLowerCase();
    const email = (payload?.email_usuario || "").toLowerCase();
    // Aceita "admin" ou "administrador" como tipos válidos
    const isValidAdmin = role === "admin" || role === "administrador" || ADMIN_EMAILS.includes(email);
    if (!isValidAdmin) {
        // redirect
    }
}
```

### 3. Backend - `Backend_tcc/src/utils/roles.ts`

**Antes:**
```typescript
export const ADMIN_EMAILS = ["lilvhx@gmail.com"]; 

export function isAdmin(role?: string | null, email?: string | null): boolean {
  if (role && role.toLowerCase() === "administrador") return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
  return false;
}
```

**Depois:**
```typescript
// Lista vazia - verificação apenas por tipo_usuario do banco
export const ADMIN_EMAILS: string[] = []; 

export function isAdmin(role?: string | null, email?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase();
  // Aceita "admin" ou "administrador" como tipos válidos
  if (normalized === "admin" || normalized === "administrador") return true;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return true;
  return false;
}
```

### 4. Backend - `Backend_tcc/src/controllers/users/updateUserController.ts`

**Antes:**
```typescript
function canChangeTipoUsuario(requestingRole?: string) {
    const r = requestingRole?.toLowerCase();
    return r === "adm" || r === "admin";
}
```

**Depois:**
```typescript
function canChangeTipoUsuario(requestingRole?: string) {
    const r = requestingRole?.toLowerCase();
    return r === "admin" || r === "administrador";
}
```

### 5. Backend - `Backend_tcc/src/services/pergunta/deletePergunta.ts`

**Antes:**
```typescript
const isAdmin = (deleteRole || "").toLowerCase() === "administrador" || 
                (deleteEmail || "").toLowerCase() === "lilvhx@gmail.com";
```

**Depois:**
```typescript
const roleNormalized = (deleteRole || "").toLowerCase();
const isAdmin = roleNormalized === "admin" || roleNormalized === "administrador";
```

## 🔐 Como Funciona Agora

### 1. Login
Quando um usuário faz login, o backend retorna um JWT com:
```typescript
{
  id: "...",
  nome_usuario: "...",
  email_usuario: "...",
  tipo_usuario: "Admin"  // ← Vem direto do banco (tipoUsuario.nome_tipousuario)
}
```

### 2. Middleware (Next.js)
O middleware decodifica o token e verifica:
```typescript
const role = payload.tipo_usuario.toLowerCase(); // "admin"
const isValidAdmin = role === "admin" || role === "administrador";
```

### 3. Server Component (Dashboard Page)
A página do dashboard valida novamente:
```typescript
const decoded = jwtDecode(token);
const role = decoded?.tipo_usuario; // "Admin"
if (!isAdmin(role)) redirect("/home");
```

### 4. Validações no Backend
Controllers e services verificam permissões:
```typescript
const isAdmin = role.toLowerCase() === "admin" || role === "administrador";
```

## ✅ Resultado

Agora **TODOS** os usuários com `tipo_usuario = "Admin"` no banco têm acesso ao dashboard, sem precisar estar em listas hardcoded de emails.

### Tipos no Banco (Confirmado):
- **Admin** → ✅ Acesso ao dashboard
- **Professor** → ❌ Sem acesso ao dashboard
- **Aluno** → ❌ Sem acesso ao dashboard

## 🧪 Como Testar

1. Faça login com um usuário do tipo "Admin"
2. O token JWT terá `tipo_usuario: "Admin"`
3. Acesse `/dashboard` → deve funcionar
4. Faça login com um usuário "Professor" ou "Aluno"
5. Tente acessar `/dashboard` → será redirecionado para `/home`
