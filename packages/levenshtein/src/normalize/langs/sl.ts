import { mapStep, type Step } from '../steps.ts';

export const sl: readonly Step[] = [
  // Slovene is nearly ISV already; the only real-world noise is dictionary
  // accent/tonal marks (góra→gora, svét→svet)
  mapStep('sl-accents', {
    á: 'a',
    à: 'a',
    â: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ó: 'o',
    ò: 'o',
    ô: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ŕ: 'r',
  }),
];
