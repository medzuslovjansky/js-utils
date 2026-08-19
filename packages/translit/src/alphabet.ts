/**
 * Everything a word can be spelled with on the way in.
 *
 * Interslavic is written in more than one alphabet and, within the Latin one,
 * in more than one orthography: the etymological letters (`ę ų ě ė ȯ å ŕ ť`),
 * the plain-ASCII stand-ins people type instead, the Czech-ish and Polish-ish
 * variants, and Cyrillic and its older iotated spellings. All of it reduces to
 * the etymological alphabet first, and only then goes out to a target script.
 *
 * These lists are that input surface, split by where a character comes from.
 * `alphabet.test.ts` checks them against the two things that define it — the
 * lexicon and the engine's own rules — so a letter cannot be added to one
 * without showing up here.
 */

/** The etymological alphabet: what a normalized Interslavic word is built from. */
export const ETYMOLOGICAL = [...'abcčćdďđeěėęfghijklľmnńoȯprŕsśštťuųvyzźžå'];

/**
 * Spellings that mean an etymological letter but are not it: ASCII fallbacks
 * (`q x w`), the accents other Slavic orthographies use, and the Latin-alphabet
 * digraph characters.
 */
export const LATIN_EXTENSIONS = [
  ...'qxwàáâãäèéêëìíîïòóôöùúûüāăąēĕīĭōŏœũūŭůǉǌǫȣıĺļņňñŕřṙṱḓ',
];

/** Cyrillic input, standard and traditional-iotated. */
export const CYRILLIC = [
  ...'абвгдеєжзиійклмнопрстуфхцчшщъыьэюяёђѓјћќѕѡѣѫѭѧѩѳѵѷѹґꙁꙑꙗ',
];

/** Marks that are not letters but that the rules key on all the same. */
export const MODIFIERS = [...'`’-ˌ̯'];

/** The whole input surface, deduplicated and ordered. */
export const ALPHABET: readonly string[] = [
  ...new Set([...ETYMOLOGICAL, ...LATIN_EXTENSIONS, ...CYRILLIC, ...MODIFIERS]),
].sort();
