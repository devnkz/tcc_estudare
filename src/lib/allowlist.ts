export type Identity = { id?: string | null; email?: string | null };

function parseList(val?: string) {
  if (!val) return [] as string[];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isDashboardAllowed(identity: Identity) {
  const ids = parseList(process.env.DASHBOARD_ALLOWED_IDS);
  const emails = parseList(process.env.DASHBOARD_ALLOWED_EMAILS);
  if (!ids.length && !emails.length) return true; // se não configurar, libera (ajuste conforme desejar)
  const okId = identity.id && ids.includes(identity.id);
  const okEmail = identity.email && emails.includes(identity.email);
  return Boolean(okId || okEmail);
}
