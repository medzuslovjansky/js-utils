/**
 * Puts the original capitalisation back: all lower, first letter only, or all
 * upper. IPA is always lower — a phonetic transcription has no case.
 *
 * Moved here unchanged from the original engine. `replaceByWord` has its own
 * case restorer with the same three-way rule but no IPA exception; the two are
 * not interchangeable, so this one stays with the engine that needs it.
 */
export function restoreCase(
  word: string,
  originalWord: string,
  isIpa = false,
): string {
  // the caller wraps the word in `%` markers; the case lives inside them
  const original = originalWord.replace(/%/g, '');

  const first = word.charAt(0);
  const rest = word.substring(1);

  if (isIpa || original.charAt(0) === original.charAt(0).toLowerCase()) {
    return word.toLowerCase();
  } else if (
    original.length > 1 &&
    original.charAt(1) === original.charAt(1).toLowerCase()
  ) {
    return first.toUpperCase() + rest.toLowerCase();
  } else {
    return word.toUpperCase();
  }
}
