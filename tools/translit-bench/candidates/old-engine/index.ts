import {
  FlavorizationType as F,
  TransliterationType as T,
  transliterate as raw,
} from './engine.ts';

/**
 * The engine as it shipped before the rewrite, wrapped in the current BCP 47
 * dispatch so the harness can time it beside its replacement.
 *
 * It is expected to fail the correctness gate on the five Glagolitic tags and
 * only those: Glagolitic now goes through a different converter by choice, not
 * by accident. Everything else must still match byte for byte — if it does not,
 * something is wrong with this wrapper rather than with either engine.
 */
const TARGETS: Record<string, [number, string | number]> = {
  'isv-Latn': [T.Latin, F.Standard],
  'isv-Latn-x-etymolog': [T.Latin, F.Etymological],
  'isv-Latn-x-northern': [T.Latin, F.Northern],
  'isv-Latn-x-southern': [T.Latin, F.Southern],
  'isv-Latn-x-sloviant': [T.Latin, F.Slovianto],
  'isv-Latn-x-ascii': [T.ASCII, F.Standard],
  'isv-Latn-PL': [T.Polish, F.Etymological],
  'isv-Cyrl': [T.StandardCyrillic, F.Standard],
  'isv-Cyrl-x-etymolog': [T.StandardCyrillic, F.Etymological],
  'isv-Cyrl-x-northern': [T.StandardCyrillic, F.Northern],
  'isv-Cyrl-x-southern': [T.StandardCyrillic, F.Southern],
  'isv-Cyrl-x-sloviant': [T.StandardCyrillic, F.Slovianto],
  'isv-Cyrl-x-iotated': [T.TraditionalIotatedCyrillic, F.Standard],
  'isv-Cyrl-x-iotated-ext': [T.TraditionalIotatedCyrillic, F.CyrillicExtended],
  'isv-Glag': [T.Glagolitic, F.Standard],
  'isv-Glag-x-etymolog': [T.Glagolitic, F.Etymological],
  'isv-Glag-x-northern': [T.Glagolitic, F.Northern],
  'isv-Glag-x-southern': [T.Glagolitic, F.Southern],
  'isv-Glag-x-sloviant': [T.Glagolitic, F.Slovianto],
  'isv-x-fonipa': [T.IPA, F.Etymological],
};

export function transliterate(text: string, tag: string): string {
  const target = TARGETS[tag];
  if (!target) throw new TypeError(`Unsupported IETF BCP47 tag: ${tag}`);
  return raw(text, target[0], target[1]);
}
