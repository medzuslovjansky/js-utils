/**
 * Puts the original capitalisation back: all lower, first letter only, or all
 * upper. IPA is always lower — a phonetic transcription has no case.
 *
 * Moved here unchanged from the original engine. `replaceByWord` has its own
 * case restorer with the same three-way rule but no IPA exception; the two are
 * not interchangeable, so this one stays with the engine that needs it.
 */
export function restoreCase(
  __iW: string,
  __OrigW: string,
  type: string | number,
): string {
  let iW = __iW;
  // the caller wraps the word in `%` markers; the case lives inside them
  const OrigW = __OrigW.replace(/%/g, '');

  const iW_first = iW.charAt(0);
  const iW_rest = iW.substring(1);

  if (type == 10 || OrigW.charAt(0) == OrigW.charAt(0).toLowerCase()) {
    iW = iW.toLowerCase();
  } else if (
    OrigW.length > 1 &&
    OrigW.charAt(1) == OrigW.charAt(1).toLowerCase()
  ) {
    iW = iW_first.toUpperCase() + iW_rest.toLowerCase();
  } else {
    iW = iW.toUpperCase();
  }

  return iW;
}
