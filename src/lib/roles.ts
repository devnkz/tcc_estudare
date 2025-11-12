// Centralized role hierarchy & helpers
export type UserRole = 'aluno' | 'professor' | 'administrador';

// Ordem de força
export const ROLE_POWER: Record<UserRole, number> = {
  aluno: 1,
  professor: 2,
  administrador: 3,
};

export function isAdmin(role?: string | null): boolean {
  return role?.toLowerCase() === 'administrador';
}

export function compareRolePriority(a: UserRole, b: UserRole): number {
  return ROLE_POWER[a] - ROLE_POWER[b];
}

export function hasAtLeast(role: UserRole | undefined, min: UserRole): boolean {
  if (!role) return false;
  return ROLE_POWER[role] >= ROLE_POWER[min];
}

// Admin emails (overrides role check)
export const ADMIN_EMAILS: string[] = ['lilvhx@gmail.com'];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
