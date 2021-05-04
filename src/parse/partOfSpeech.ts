import { PartOfSpeech } from '../types';

export default function parsePartOfSpeech(rawAbbr: string): PartOfSpeech {
  if (typeof rawAbbr !== 'string') {
    throw new Error(`Expected a string, but got: ${JSON.stringify(rawAbbr)}`);
  }

  let abbr = rawAbbr.trim();
  if (abbr[0] === '#') {
    abbr = abbr.slice(1); // TODO: add this metadata to part of speech
  }

  if (abbr.startsWith('v.')) {
    return {
      name: 'verb',
      auxiliary: abbr.includes('aux'),
      imperfective: abbr.includes('ipf'),
      intransitive: abbr.includes('intr'),
      perfective: /\bpf/.test(abbr),
      reflexive: abbr.includes('refl'),
      transitive: /\btr/.test(abbr),
    };
  }

  if (
    abbr.startsWith('noun') ||
    abbr.startsWith('m.') ||
    abbr.startsWith('f.') ||
    abbr.startsWith('n.')
  ) {
    return {
      name: 'noun',
      masculine: abbr.includes('m.'),
      feminine: abbr.includes('f.'),
      neuter: abbr.includes('n.'),
      animate: abbr.includes('anim.'),
      indeclinable: abbr.includes('indecl.'),
      singular: abbr.includes('sg.'),
      plural: abbr.includes('pl.'),
    };
  }

  if (abbr.startsWith('num')) {
    return {
      name: 'numeral',
      cardinal: abbr.includes('card'),
      collective: abbr.includes('coll'),
      differential: abbr.includes('diff'),
      fractional: abbr.includes('fract'),
      multiplicative: abbr.includes('mult'),
      ordinal: abbr.includes('ord'),
      substantivized: abbr.includes('subst'),
    };
  }

  if (abbr.startsWith('pron')) {
    return {
      name: 'pronoun',
      demonstrative: abbr.includes('dem'),
      indefinite: abbr.includes('indef'),
      interrogative: abbr.includes('int'),
      personal: abbr.includes('pers'),
      possessive: abbr.includes('poss'),
      reciprocal: abbr.includes('rec'),
      reflexive: abbr.includes('refl'),
      relative: abbr.includes('rel'),
    };
  }

  if (abbr.startsWith('adj')) {
    return { name: 'adjective' };
  }

  if (abbr.startsWith('adv')) {
    return { name: 'adverb' };
  }

  if (abbr.startsWith('conj')) {
    return { name: 'conjunction' };
  }

  if (abbr.startsWith('intj')) {
    return { name: 'interjection' };
  }

  if (abbr.startsWith('prep')) {
    return { name: 'preposition' };
  }

  if (abbr === 'particle') {
    return { name: 'particle' };
  }

  if (abbr === 'phrase') {
    return { name: 'phrase' };
  }

  if (abbr === 'prefix') {
    return { name: 'prefix' };
  }

  if (abbr === 'suffix') {
    return { name: 'suffix' };
  }

  throw new Error(`Failed to parse the part of speech in: ${rawAbbr}`);
}
