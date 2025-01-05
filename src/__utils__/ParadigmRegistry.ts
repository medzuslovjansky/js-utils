import { createHash } from 'node:crypto';

let instance: ParadigmRegistry;
/**
 * A singleton-like class to keep track of unique paradigms
 * based on an array of endings (or any morphological signature).
 */
export class ParadigmRegistry {
  // eslint-disable-next-line ecmascript-compat/compat
  private readonly map: Map<
    string,
    { endings: string[]; lemmas: { lemma: string; pos: string }[] }
  >;

  constructor() {
    this.map = new Map();
  }

  /**
   * Retrieve the single instance of the registry.
   */
  public static getInstance(): ParadigmRegistry {
    if (!instance) {
      instance = new ParadigmRegistry();
    }
    return instance;
  }

  /**
   * Add an item (lemma) with its morphological signature (endings).
   * @param endings Array of morphological endings or forms.
   * @param lemma   The lexical item, e.g. "beautiful", "dog", etc.
   * @param pos     Part of speech or any descriptor (adjective, noun, etc.).
   */
  public register(endings: string[], lemma: string, pos: string) {
    // Sort and create a stable fingerprint
    const sortedEndings = endings.slice().sort();
    const fingerprint = createHash('sha256')
      .update(sortedEndings.join(':'))
      .digest('hex');

    // If new pattern, store it
    if (!this.map.has(fingerprint)) {
      this.map.set(fingerprint, { endings: sortedEndings, lemmas: [] });
    }

    // Push the lemma reference
    this.map.get(fingerprint)!.lemmas.push({ lemma, pos });
  }

  /**
   * Return paradigms sorted by frequency (descending).
   * Also assign simple A, B, C... labels.
   */
  public getSortedParadigms() {
    const items: {
      fingerprint: string;
      endings: string[];
      lemmas: { lemma: string; pos: string }[];
      count: number;
      label?: string;
    }[] = [];

    // Collect all entries
    for (const [fingerprint, { endings, lemmas }] of this.map.entries()) {
      if (!lemmas.some((l) => l.pos === 'adjective')) {
        continue;
      }

      items.push({
        fingerprint,
        endings,
        lemmas,
        count: lemmas.length,
      });
    }

    // Sort by frequency
    items.sort((a, b) => b.count - a.count);

    // Assign simple labels A, B, C, ... (or AA, AB, ... if you have many)
    let labelCharCode = 65; // 'A'
    items.forEach((item) => {
      item.label = String.fromCharCode(labelCharCode++);
    });

    return Object.fromEntries(
      items.map((item) => [
        item.label,
        {
          endings: item.endings,
          lemmas: item.lemmas.map((l) => l.lemma),
        },
      ]),
    );
  }
}
