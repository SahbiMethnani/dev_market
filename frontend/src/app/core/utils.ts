export function errorMessage(e: any): string {
  const detail = e?.error?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0];
    const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : '';
    return `${field ? field + ' : ' : ''}${first.msg}`;
  }
  if (e?.status === 0) return 'Serveur injoignable';
  return 'Une erreur est survenue';
}
