import { createReplacer } from './createReplacer.ts';
import { dropFinalYer, readGlagoliticYers, separateYer } from './yers.ts';

/**
 * Ports v1's `nmsifyLoose` / `nmsifyStrict` (see
 * `../transliterate/transliterate.ts`) onto v2's declarative-table
 * machinery. These two functions turn arbitrary input spellings (ASCII
 * fallbacks, accented Latin from other Slavic orthographies, Cyrillic, older
 * iotated Cyrillic) into the canonical etymological Interslavic alphabet.
 *
 * Calling convention matches v1 exactly, so the two are directly
 * comparable: `word` must already be lowercased and wrapped in `%`
 * word-boundary markers, e.g. `normalizeInput('%' + w.toLowerCase() + '%')`.
 * The `%` markers are meaningful input to some rules (prefix-anchored
 * clusters like `%bezs`) and are preserved verbatim in the output, same as
 * v1. `replaceByWord` elsewhere in this directory hands its replacer a bare
 * word instead; this module deliberately keeps `%` because it is v1's own
 * convention and several rules hardcode it on both sides of the
 * replacement, so no extra adaptation is needed.
 *
 * v1's chain of ~90 sequential `.replace()` calls is order-dependent: a
 * handful of later rules consume markers (`#`) or characters produced by
 * earlier rules. `createReplacer` performs one longest-match left-to-right
 * scan per table and never rescans its own output, so a single flat table
 * cannot replicate the whole chain. Instead the chain is split into the
 * minimal number of sequential passes such that, within each pass, no rule
 * depends on another rule of the *same* pass having already run — at that
 * point every pass reduces to an ordinary flat lookup table, which is what
 * they are below. Every rule in both v1 functions is a literal
 * substring/character-class substitution (no regex look-around), so no
 * context-dependent helper functions were needed for this phase.
 */

// Pass 0 — Glagolitic transliteration to standard base before Cyrillic/Latin normalization
const GLAGOLITIC_LETTERS: Record<string, string> = {
  ⱐⰹ: 'y',
  ⱏⰹ: 'y',
  ⱍⱐ: 'ć',
  ⰰ: 'a',
  ⰱ: 'b',
  ⰲ: 'v',
  ⰳ: 'g',
  ⰴ: 'd',
  ⰵ: 'e',
  ⰶ: 'ž',
  ⰷ: 'dz',
  ⰸ: 'z',
  ⰹ: 'j',
  ⰺ: 'j',
  ⰻ: 'i',
  ⰼ: 'đ',
  ⰽ: 'k',
  ⰾ: 'l',
  ⰿ: 'm',
  ⱀ: 'n',
  ⱁ: 'o',
  ⱂ: 'p',
  ⱃ: 'r',
  ⱄ: 's',
  ⱅ: 't',
  ⱆ: 'u',
  ⱇ: 'f',
  ⱈ: 'h',
  ⱉ: 'å',
  ⱊ: 'p',
  ⱋ: 'ć',
  ⱌ: 'c',
  ⱍ: 'č',
  ⱎ: 'š',
  ⱏ: 'ȯ',
  ⱐ: 'ь',
  ⱑ: 'ě',
  ⱒ: 'h',
  ⱓ: 'ju',
  ⱔ: 'ę',
  ⱕ: 'ę',
  ⱖ: 'jo',
  ⱗ: 'ję',
  ⱘ: 'ų',
  ⱙ: 'jų',
  ⱚ: 't',
  ⱛ: 'u',
  ⱜ: '',
  ⱝ: 'ja',
  ⱞ: 'm',
  '\u0483': '', // titlo: abbreviation mark, no Latin counterpart
};

const glagoliticLetters = createReplacer(GLAGOLITIC_LETTERS);
const pass0 = (word: string): string =>
  glagoliticLetters(readGlagoliticYers(word));

// Pass 1 — iotated/nasalized Cyrillic vowels, softened with a `#` marker so
// the palatalization survives until pass 2 can decide what to do with it.
const IOTATED_CYRILLIC: Record<string, string> = {
  я: '#a',
  ꙗ: '#a',
  ьа: '#a',
  ѥ: '#e',
  ье: '#e',
  ї: '#i',
  ьи: '#i',
  ё: '#o',
  ьо: '#o',
  ю: '#u',
  ьу: '#u',
  ѩ: '#ę',
  ьѧ: '#ę',
  ѭ: '#ų',
  ьѫ: '#ų',
};
const pass1 = createReplacer(IOTATED_CYRILLIC);

// Pass 2 — soft consonants: consumes the `#` marker pass 1 left behind (or
// a literal Cyrillic soft sign `ь`) to spell out the softened consonant.
const SOFT_CONSONANTS: Record<string, string> = {
  нь: 'ń',
  'н#': 'nj',
  њ: 'nj',
  ль: 'ĺ',
  'л#': 'lj',
  љ: 'lj',
  рь: 'ŕ',
  'р#': 'ŕ',
  ть: 'ť',
  'т#': 'ť',
  дь: 'ď',
  'д#': 'ď',
  сь: 'ś',
  'с#': 'ś',
  зь: 'ź',
  'з#': 'ź',
  'ь%': '%',
  // at the end of a word n and l are `nj`, `lj` (konь, кралъ), as in Glagolitic
  'нь%': 'nj%',
  'ль%': 'lj%',
  // a Latin word ending in a Cyrillic soft sign (konь) is read the same way
  'nь%': 'nj%',
  'lь%': 'lj%',
  'rь%': 'ŕ%',
  'tь%': 'ť%',
  'dь%': 'ď%',
  'sь%': 'ś%',
  'zь%': 'ź%',
};
const pass2 = createReplacer(SOFT_CONSONANTS);

// Pass 3 — the bulk single-character Cyrillic-to-Latin lookup table, plus
// the generic leftover-marker cleanup ([йјь#] -> j) that must run after
// pass 2 has had first claim on `#`/`ь` next to a consonant.
const CYRILLIC_LETTERS: Record<string, string> = {
  ђ: 'đ',
  ѓ: 'đ',
  ћ: 'ć',
  ќ: 'ć',
  ѕ: 'dz',
  џ: 'dž',
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  ґ: 'g',
  д: 'd',
  е: 'e',
  э: 'e',
  є: 'ě',
  ѣ: 'ě',
  ж: 'ž',
  з: 'z',
  ꙁ: 'z',
  Ꙁ: 'z',
  и: 'i',
  і: 'i',
  ѵ: 'i',
  ѷ: 'i',
  й: 'j',
  ј: 'j',
  ь: 'j',
  '#': 'j',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  ѡ: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ѳ: 't',
  у: 'u',
  ȣ: 'u',
  ѹ: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'č',
  ш: 'š',
  щ: 'šč',
  ы: 'y',
  ꙑ: 'y',
  ъ: 'ȯ', // Fixed by Denis Šabalin; a word-final one, see FINAL_YER
  ў: 'ŭ',
  ѧ: 'ę',
  ѫ: 'ų',
  ѱ: 'ps',
  ѯ: 'ks',
  ӑ: 'å', // Added by Denis Šabalin
  '⁙': '.',
};
const pass3 = createReplacer(CYRILLIC_LETTERS);

// Pass 4 — Latin-side cluster resolution. These react to plain Latin
// letters, which by this point may either be original input or the output
// of pass 3's Cyrillic conversion, so this pass must run after pass 3.
const LATIN_CLUSTERS: Record<string, string> = {
  zsk: 'z#sk',
  zst: 'z#st',
  '%izs': '%iz#s',
  '%bezs': '%bez#s',
  '%obezs': '%obez#s',
  '%razs': '%raz#s',
  '%råzs': '%råz#s',
  '%szadu%': '%s#zadu%',
  '%vozs': '%voz#s',
  '%vȯzs': '%vȯz#s',
  konjug: 'kon#jug',
  konjun: 'kon#jun',
  injek: 'in#jek',
  sx: 'š',
  sz: 'š',
  cx: 'č',
  cz: 'č',
  zx: 'ž',
  zs: 'ž',
  ż: 'ž',
  ye: 'ě',
  qu: 'kv',
  ŀ: 'ȯl',
  ă: '’',
  q: '’',
  '`': '’',
  ch: 'h',
  w: 'v',
  x: 'ks',
};
const pass4 = createReplacer(LATIN_CLUSTERS);

// The `konjug`/`konjun`/`injek` prefix-boundary rule and the single-char
// accent-stripping rules that `nmsifyStrict` also applies verbatim.
const KONJUG_CLUSTER: Record<string, string> = {
  konjug: 'kon#jug',
  konjun: 'kon#jun',
  injek: 'in#jek',
};
const SHARED_ACCENTS: Record<string, string> = {
  á: 'a',
  d́: 'ď',
  é: 'e',
  ì: 'i',
  í: 'i',
  ĵ: 'j',
  ĺ: 'ľ',
  ó: 'o',
  œ: 'o',
  t́: 'ť',
  ý: 'y',
};

// Pass 5 — accented Latin (other Slavic orthographies) normalized down to
// the canonical etymological letters. Independent of pass 4 (disjoint
// alphabets, no shared characters either direction) but must run before
// pass 6, whose rules react to the `y` this pass produces from `ý`.
const ACCENTED_LATIN: Record<string, string> = {
  ...SHARED_ACCENTS,
  à: 'a',
  â: 'a',
  ā: 'a',
  î: 'i',
  ī: 'i',
  ĭ: 'i',
  // NMS's tense yer next to j (znanıje) softens the consonant before it, as a
  // soft sign does (znańje); after any other consonant it is silent (bıj)
  nı: 'ń',
  lı: 'ľ',
  rı: 'ŕ',
  tı: 'ť',
  dı: 'ď',
  sı: 'ś',
  zı: 'ź',
  ı: '',
  ú: 'u',
  û: 'u',
  ů: 'u',
  ū: 'u',
  ą: 'ų',
  ǫ: 'ų',
  ũ: 'ų',
  ù: 'ŭ',
  ē: 'e',
  ĕ: 'ė',
  ë: 'ė',
  è: 'ė',
  ô: 'o',
  ŏ: 'ȯ',
  ö: 'ȯ',
  ò: 'ȯ',
  ł: 'l',
  ç: 'c',
  ʒ: 'z',
  ļ: 'ľ',
  ǉ: 'ľ',
  ň: 'ń',
  ñ: 'ń',
  ņ: 'ń',
  ǌ: 'ń',
  ř: 'ŕ',
};
const pass5 = createReplacer(ACCENTED_LATIN);

// Pass 6 — suffix `y` softens to `i` after a consonant that already carries
// its own palatalization, and a stray double `j` collapses to one. Must
// run after pass 5: the `y` this reacts to may come from `ý` (pass 5).
const TRAILING_SOFT_Y: Record<string, string> = {
  jy: 'ji',
  ćy: 'ći',
  đy: 'đi',
  šy: 'ši',
  žy: 'ži',
  čy: 'či',
  jj: 'j',
};
const pass6 = createReplacer(TRAILING_SOFT_Y);

const looseReplacer = (word: string): string =>
  pass6(pass5(pass4(pass3(pass2(pass1(pass0(word)))))));

// Naučny Medžuslovjanski spells two things with letters that mean something
// else here: its `ė` is the e of *er/*el (`ě` here, where `ė` is a strong
// front yer), and its `ĺ` between consonants is a syllabic l (`ȯl` here, where `ĺ` is a soft l).
// Only the Latin letters themselves: `ĺ` read from Cyrillic `ль` or from a
// Glagolitic ⰾⱐ is made later and is the soft l it always was.
const NMS_CONSONANT = 'bcčćdđfghjklľmnńprŕsšśtťvzžź';
const nmsLetters = (word: string): string =>
  word
    .replace(/ė/g, 'ě')
    .replace(
      new RegExp(`(?<=[${NMS_CONSONANT}])ĺ(?=[${NMS_CONSONANT}])`, 'g'),
      'ȯl',
    );

// nmsifyStrict is applied to input that is already close to canonical
// (see v1's `preprocessed` flag): just the prefix-boundary cluster rule,
// one hardcoded Wi-Fi exception, and single-character accent stripping —
// no Cyrillic handling, no cluster resolution. All rules here are mutually
// independent (none reacts to another rule's output), so a single table
// covers the whole function.
const STRICT_TABLE: Record<string, string> = {
  ...KONJUG_CLUSTER,
  '%wifi%': '%vifi%',
  ...SHARED_ACCENTS,
};
const strictReplacer = createReplacer(STRICT_TABLE);

/** How `transliterate` and `normalize` read their input. */
export interface NormalizeOptions {
  /**
   * What the input is written in.
   *
   * - `'auto'` reads anything: ASCII fallbacks, Cyrillic, Glagolitic, the
   *   accents of other orthographies. It does not guess; every spelling has
   *   one reading.
   * - `'isv-x-etymolog'` is for input already in the etymological alphabet.
   *   Nothing is respelled: `czas` stays `czas`, Cyrillic is not read.
   *
   * - `'isv-x-nms'` is `'auto'` for a text in Naučny Medžuslovjanski: the
   *   Latin letters `ė` and `ĺ` are read as `ě` and `ȯl`. Nothing else
   *   changes; Cyrillic and Glagolitic are read as before.
   *
   * @default 'auto'
   */
  input?: 'auto' | 'isv-x-etymolog' | 'isv-x-nms';

  /**
   * What a word-final hard yer is: Glagolitic `ⱏ`, Cyrillic `ъ`, or `ъ` at the
   * end of a Latin word (`dųbъ`). Yers inside a word are not touched, and
   * neither is a Latin `ȯ`. Has no effect with `input: 'isv-x-etymolog'`,
   * which reads no yers at all.
   *
   * - `'auto'`: silent after a vowel (`ⰽⰰⱀⰰⰾⱏ` is `kanal`), `ȯ` in a word that
   *   has no vowel before it (`ⰲⱏ` is `vȯ`).
   * - `'drop'`: always silent (`ⰲⱏ` is `v`), unless it is the whole word.
   * - `'keep'`: always `ȯ` (`ⰽⰰⱀⰰⰾⱏ` is `kanalȯ`).
   *
   * @default 'auto'
   */
  finalYer?: 'auto' | 'drop' | 'keep';

  /**
   * Whether Glagolitic letters stand for numbers. A number is a Glagolitic word
   * with a titlo (U+0483) at its end: `ⰸⰺ҃` is 19. Only 1 to 999; anything else
   * stays as it is written.
   *
   * - `false`: the titlo is dropped and the letters are read as a word; digits
   *   are never touched.
   * - `true`: such a word is read as its number, and a Glagolitic target gets
   *   its numbers from 1 to 999 written in letters. `input: 'isv-x-etymolog'`
   *   reads no Glagolitic, numbers included.
   *
   * @default false
   */
  alphabeticalNumerals?: boolean;
}

/**
 * Normalizes arbitrary input spellings (ASCII fallbacks, accented Latin,
 * Cyrillic, older iotated Cyrillic) down to the canonical etymological
 * Interslavic alphabet — the first phase of the transliteration pipeline.
 *
 * `word` must already be lowercased and wrapped in `%` boundary markers,
 * exactly as v1's `nmsifyLoose`/`nmsifyStrict` expect (see module doc).
 * `input: 'isv-x-etymolog'` is v1's `nmsifyStrict`, the default its
 * `nmsifyLoose`; `'isv-x-nms'` is the default with two letters re-read first.
 */
export function normalizeInput(
  word: string,
  options: NormalizeOptions = {},
): string {
  if (options.input === 'isv-x-etymolog') return strictReplacer(word);

  const { finalYer = 'auto' } = options;
  const read = options.input === 'isv-x-nms' ? nmsLetters(word) : word;

  return looseReplacer(separateYer(dropFinalYer(read, finalYer)));
}
