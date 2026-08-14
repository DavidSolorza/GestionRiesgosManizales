/**
 * Calcula el tiempo relativo formateado en español a partir de una cadena de fecha ISO.
 */
export function getRelativeTime(isoDateString: string): string {
  if (!isoDateString) return 'hace un momento';

  const now = Date.now();
  const then = new Date(isoDateString).getTime();

  if (isNaN(then)) return 'hace un momento';

  const diffMs = Math.max(0, now - then);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHr < 24) return `Hace ${diffHr} h`;
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}
