// Centralized role hierarchy & helpers
export type UserRole = 'Aluno' | 'Professor' | 'Admin';

// Ordem de força
export const ROLE_POWER: Record<UserRole, number> = {
  Aluno: 1,
  Professor: 2,
  Admin: 3,
};

export function isAdmin(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase();
  return normalized === 'admin' || normalized === 'administrador';
}

export function compareRolePriority(a: UserRole, b: UserRole): number {
  return ROLE_POWER[a] - ROLE_POWER[b];
}

export function hasAtLeast(role: UserRole | undefined, min: UserRole): boolean {
  if (!role) return false;
  return ROLE_POWER[role] >= ROLE_POWER[min];
}

// Admin emails - lista vazia agora, pois a verificação é por tipo_usuario
export const ADMIN_EMAILS: string[] = [];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
