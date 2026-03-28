export function requireAdmin(locals: App.Locals): Response | null {
  if (!locals.user) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }
  if (!locals.isAdmin) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }
  return null;
}
