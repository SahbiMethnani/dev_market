import { randomInt } from 'crypto';

/**
 * Générateur de données aléatoires pour les tests Playwright.
 */

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

const FIRST_NAMES = [
  'Sahbi', 'Amine', 'Yassine', 'Mohamed', 'Karim', 'Walid', 'Hamza', 'Anis',
  'Sarra', 'Ines', 'Mariem', 'Nour', 'Rim', 'Asma', 'Salma', 'Yasmine',
];

const LAST_NAMES = [
  'Methnani', 'BenAli', 'Trabelsi', 'Gharbi', 'Jebali', 'Mansouri', 'Hamdi',
  'Bouazizi', 'Chaabane', 'Dridi', 'Ferchichi', 'Khelifi', 'Mejri', 'Sassi',
];

const EMAIL_DOMAINS = ['example.com', 'test.com', 'mailinator.com'];

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()-_=+';

function pick<T>(items: readonly T[]): T {
  return items[randomInt(items.length)];
}

function pickChar(chars: string): string {
  return chars[randomInt(chars.length)];
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

export function randomName(): string {
  return `${pick(FIRST_NAMES)}${pick(LAST_NAMES)}`;
}


export function randomEmail(name?: string): string {
  const base = slugify(name ?? randomName());
  const unique = `${Date.now().toString(36)}${randomInt(1000, 9999)}`;
  return `${base}.${unique}@${pick(EMAIL_DOMAINS)}`;
}


export function randomPassword(length = 12): string {
  const size = Math.max(length, 8);
  const all = LOWER + UPPER + DIGITS + SPECIAL;

  const chars = [
    pickChar(LOWER),
    pickChar(UPPER),
    pickChar(DIGITS),
    pickChar(SPECIAL),
  ];
  while (chars.length < size) {
    chars.push(pickChar(all));
  }
  return shuffle(chars).join('');
}

/** Génère un utilisateur complet : nom + email + mot de passe. */
export function generateUser(): TestUser {
  const name = randomName();
  return {
    name,
    email: randomEmail(name),
    password: randomPassword(),
  };
}