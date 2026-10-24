import { describe, expect, it } from 'vitest';
import { errorMessage } from './utils';

describe('errorMessage', () => {
  it('returns string detail from API error', () => {
    expect(errorMessage({ error: { detail: 'Email déjà utilisé' } })).toBe('Email déjà utilisé');
  });

  it('returns unreachable message when status is 0', () => {
    expect(errorMessage({ status: 0 })).toBe('Serveur injoignable');
  });

  it('returns generic message for unknown errors', () => {
    expect(errorMessage({})).toBe('Une erreur est survenue');
  });
});
