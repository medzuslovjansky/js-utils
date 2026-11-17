import { prosody, type Step } from '../steps.ts';

// Slovene is nearly ISV already; the only real-world noise is dictionary
// accent/tonal marks (góra→gora, svét→svet, jẹ̑zero→jezero)
export const sl: readonly Step[] = [prosody];
