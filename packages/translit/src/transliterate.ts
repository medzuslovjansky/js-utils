import type { FlavorisationBCP47Code } from './constants/index.ts';
import { flavorize, type Flavour } from './flavorize.ts';
import {
  fromGlagoliticNumerals,
  toGlagoliticNumerals,
} from './glagolitic-numerals.ts';
import {
  glagToLatnMarks,
  hasGlagolitic,
  latnToGlagMarks,
} from './glagolitic-punctuation.ts';
import { latn2cyrl } from './latn2cyrl.ts';
import { latn2glag } from './latn2glag.ts';
import { latn2ipa } from './latn2ipa.ts';
import { latn2latn } from './latn2latn.ts';
import { normalizeInput, type NormalizeOptions } from './normalize-input.ts';
import { resolveLiquids } from './resolve-liquids.ts';
import { restoreCase } from './restore-case.ts';

/**
 * One word, five phases:
 *
 *   any spelling  →  normalizeInput  →  the etymological alphabet
 *                 →  resolveLiquids  →  syllabic liquids decided
 *                 →  flavorize       →  the flavour's subset of that alphabet
 *                 →  a script        →  the only phase that leaves it
 *                 →  restoreCase
 *
 * Every target is therefore `etymological → X`, and a new script is one more
 * table rather than one more path through the whole engine.
 */
type Script =
  | { kind: 'latin'; variant: 'latin' | 'ascii' | 'polish' }
  | { kind: 'cyrillic'; iotated: boolean }
  | { kind: 'glagolitic' }
  | { kind: 'ipa' };

const LATIN = (variant: 'latin' | 'ascii' | 'polish') =>
  ({ kind: 'latin', variant }) as const;
const CYRILLIC = (iotated: boolean) => ({ kind: 'cyrillic', iotated }) as const;
const GLAGOLITIC = { kind: 'glagolitic' } as const;
const IPA = { kind: 'ipa' } as const;

/** Which script and which flavour each BCP 47 tag asks for. */
const TARGETS: Record<
  Exclude<FlavorisationBCP47Code, 'isv'>,
  { script: Script; flavour: Flavour }
> = {
  'isv-Latn': { script: LATIN('latin'), flavour: '3' },
  'isv-Latn-x-etymolog': { script: LATIN('latin'), flavour: '2' },
  'isv-Latn-x-northern': { script: LATIN('latin'), flavour: 'S' },
  'isv-Latn-x-southern': { script: LATIN('latin'), flavour: 'J' },
  'isv-Latn-x-sloviant': { script: LATIN('latin'), flavour: '4' },
  'isv-Latn-x-ascii': { script: LATIN('ascii'), flavour: '3' },
  'isv-Latn-PL': { script: LATIN('polish'), flavour: '2' },

  'isv-Cyrl': { script: CYRILLIC(false), flavour: '3' },
  'isv-Cyrl-x-etymolog': { script: CYRILLIC(false), flavour: '2' },
  'isv-Cyrl-x-northern': { script: CYRILLIC(false), flavour: 'S' },
  'isv-Cyrl-x-southern': { script: CYRILLIC(false), flavour: 'J' },
  'isv-Cyrl-x-sloviant': { script: CYRILLIC(false), flavour: '4' },
  'isv-Cyrl-x-iotated': { script: CYRILLIC(true), flavour: '3' },
  'isv-Cyrl-x-iotated-ext': { script: CYRILLIC(true), flavour: '1' },

  'isv-Glag': { script: GLAGOLITIC, flavour: '3' },
  'isv-Glag-x-etymolog': { script: GLAGOLITIC, flavour: '2' },
  'isv-Glag-x-northern': { script: GLAGOLITIC, flavour: 'S' },
  'isv-Glag-x-southern': { script: GLAGOLITIC, flavour: 'J' },
  'isv-Glag-x-sloviant': { script: GLAGOLITIC, flavour: '4' },

  'isv-x-fonipa': { script: IPA, flavour: '2' },
};

function toScript(word: string, script: Script, flavour: Flavour): string {
  switch (script.kind) {
    case 'latin':
      return latn2latn(word, { flavour, variant: script.variant });
    case 'cyrillic':
      return latn2cyrl(word, { flavour, iotated: script.iotated });
    case 'glagolitic':
      // Michal's converter, not the port of the old engine. It takes plain
      // Latin rather than a prepared string, and does its own word splitting,
      // so the phase markers come out first — `%` for the word boundary, `#`
      // for the delimiter, `ı` after a soft consonant. The flavour still
      // decides what letters it is handed, so all five Glagolitic tags stay
      // distinct even though the converter itself knows nothing about them.
      // `ṙ` is this pipeline's private mark for a syllabic hard `r`, and the
      // other converter has never heard of it — left in, it reaches the output
      // as a Latin letter in 1 708 words. Handing back the plain `r` lets it
      // run its own syllabic analysis, which is the one thing it does here
      // that this pipeline would otherwise do twice.
      return latn2glag(word.replace(/ṙ/g, 'r').replace(/[%#ı]/g, ''));
    case 'ipa':
      return latn2ipa(word, flavour);
  }
}

const INPUTS = ['auto', 'isv-x-etymolog', 'isv-x-nms'];
const FINAL_YERS = ['auto', 'drop', 'keep'];
const YERS = ['auto', 'havlik'];

function checkOptions(options: NormalizeOptions): void {
  // The third argument used to be the boolean `preprocessed`. A JavaScript
  // caller still passing `true` would otherwise silently get the default.
  if (typeof options !== 'object' || options === null) {
    throw new TypeError(
      'Options must be an object: { input: "isv-x-etymolog" } is what `true` was',
    );
  }

  const { input = 'auto', finalYer = 'auto', yers = 'auto' } = options;
  if (!INPUTS.includes(input)) {
    throw new TypeError(`Unsupported input: ${input}`);
  }
  if (!FINAL_YERS.includes(finalYer)) {
    throw new TypeError(`Unsupported finalYer: ${finalYer}`);
  }
  if (!YERS.includes(yers)) {
    throw new TypeError(`Unsupported yers: ${yers}`);
  }
}

/**
 * @param options how to read the input, see {@link NormalizeOptions}
 */
export function transliterate(
  text: string,
  lang: FlavorisationBCP47Code,
  options: NormalizeOptions = {},
): string {
  checkOptions(options);

  if (lang === 'isv') return text;

  const target = TARGETS[lang];
  if (!target) throw new TypeError(`Unsupported IETF BCP47 tag: ${lang}`);

  const { script, flavour } = target;

  // Numbers are read and written around the words, not among them: a number
  // read here is digits from now on, which no later phase touches.
  const numerals = options.alphabeticalNumerals === true;
  const readsGlagolitic = options.input !== 'isv-x-etymolog';
  const source =
    numerals && readsGlagolitic
      ? fromGlagoliticNumerals(text.normalize('NFC'))
      : text.normalize('NFC');
  const marked = hasGlagolitic(source) ? glagToLatnMarks(source) : source;

  const result = marked.replace(/[\p{Letter}\p{Mark}]+/gu, (word) => {
    // `%` marks both ends of the word; rules anchor on it, and the original
    // spelling is kept alongside so the case can be put back at the end
    const original = `%${word}%`;
    const normalized = normalizeInput(original.toLowerCase(), options);
    const flavoured = flavorize(resolveLiquids(normalized), flavour);

    return restoreCase(
      toScript(flavoured, script, flavour),
      original,
      script.kind === 'ipa',
    );
  });

  if (script.kind !== 'glagolitic') return result;

  return latnToGlagMarks(numerals ? toGlagoliticNumerals(result) : result);
}
