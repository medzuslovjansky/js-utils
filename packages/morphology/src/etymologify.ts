import { transliterate } from '@interslavic/translit';
import { stripMetacharacters } from './steen/index.ts';

/**
 * Normalize lemma by handling character variants.
 */
export function etymologify(lemma: string): string {
  // First normalize to NFC to handle combining marks
  let result = stripMetacharacters(lemma).normalize('NFC');

  // Replace character variants
  result = transliterate(result, 'isv-Latn-x-etymolog')
    // eslint-disable-next-line no-control-regex -- stripping them is the point
    .replaceAll(/[\u0000-\u001F\u007F]/g, '')
    .replaceAll('Ĺ', 'Ľ')
    .replaceAll('ĺ', 'ľ')
    .replaceAll('T́', 'Ť')
    .replaceAll('t́', 'ť')
    .replaceAll('D́', 'Ď')
    .replaceAll('d́', 'ď');

  // Sanity check: ensure no combining marks remain
  if (/\p{Mark}/gu.test(result)) {
    throw new Error(`Lemma "${lemma}" has unnormalized characters`);
  }

  return result;
}
