import {
  Adverb,
  Adjective,
  Noun,
  Numeral,
  PartOfSpeech,
  Participle,
  Pronoun,
  Verb,
} from './types';

const PF = /\bpf\b/;
const TR = /\btr\b/;

export function parsePos(rawAbbr: string): PartOfSpeech {
  if (typeof rawAbbr !== 'string') {
    throw new Error(`Expected a string, but got: ${JSON.stringify(rawAbbr)}`);
  }

  const abbr = rawAbbr.trim();
  if (abbr.startsWith('v.')) {
    return parseVerb(abbr);
  }

  if (
    abbr.startsWith('noun') ||
    abbr.startsWith('m.') ||
    abbr.startsWith('f.') ||
    abbr.startsWith('n.')
  ) {
    return parseNoun(abbr);
  }

  if (abbr.startsWith('num')) {
    return parseNumeral(abbr);
  }

  if (abbr.startsWith('pron')) {
    return parsePronoun(abbr);
  }

  if (abbr.startsWith('adj')) {
    return parseAdjective(abbr);
  }

  if (abbr.startsWith('ptcp')) {
    return parseParticiple(abbr);
  }

  if (abbr.startsWith('adv')) {
    return parseAdverb(abbr);
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

function parsePronoun(abbr: string): Pronoun {
  const demonstrative = abbr.includes('dem');
  const indefinite = abbr.includes('indef');
  const interrogative = abbr.includes('int');
  const personal = abbr.includes('pers');
  const possessive = abbr.includes('poss');
  const reciprocal = abbr.includes('rec');
  const reflexive = abbr.includes('refl');
  const relative = abbr.includes('rel');

  const pronounType = demonstrative
    ? 'demonstrative'
    : indefinite
    ? 'indefinite'
    : interrogative
    ? 'interrogative'
    : personal
    ? 'personal'
    : possessive
    ? 'possessive'
    : reciprocal
    ? 'reciprocal'
    : reflexive
    ? 'reflexive'
    : relative
    ? 'relative'
    : 'personal';

  return {
    name: 'pronoun',
    type: pronounType,
    demonstrative,
    indefinite,
    interrogative,
    personal,
    possessive,
    reciprocal,
    reflexive,
    relative,
  };
}

function parseAdjective(abbr: string): Adjective {
  return {
    name: 'adjective',
    positive: !abbr.includes('comp') && !abbr.includes('sup'),
    comparative: abbr.includes('comp'),
    superlative: abbr.includes('sup'),
    absolute: abbr.includes('abs'),
    possessive: abbr.includes('poss'),
  };
}

function parseAdverb(abbr: string): Adverb {
  return {
    name: 'adverb',
    positive: !abbr.includes('comp') && !abbr.includes('sup'),
    comparative: abbr.includes('comp'),
    superlative: abbr.includes('sup'),
    absolute: abbr.includes('abs'),
  };
}

function parseParticiple(abbr: string): Participle {
  return {
    name: 'participle',
    active: abbr.includes('act'),
    passive: abbr.includes('pass'),
    present: abbr.includes('pres'),
    past: abbr.includes('past'),
  };
}

function parseVerb(abbr: string): Verb {
  return {
    name: 'verb',
    auxiliary: abbr.includes('aux'),
    imperfective: abbr.includes('ipf'),
    intransitive: abbr.includes('intr'),
    perfective: PF.test(abbr),
    reflexive: abbr.includes('refl'),
    transitive: TR.test(abbr),
  };
}

function parseNoun(abbr: string): Noun {
  const masculine = abbr.includes('m.');
  const feminine = abbr.includes('f.');
  const neuter = abbr.includes('n.');

  return {
    name: 'noun',
    gender:
      masculine && feminine
        ? 'masculineOrFeminine'
        : masculine
        ? 'masculine'
        : feminine
        ? 'feminine'
        : 'neuter',
    masculine,
    feminine,
    neuter,
    animate: abbr.includes('anim.'),
    indeclinable: abbr.includes('indecl.'),
    singular: abbr.includes('sg.'),
    plural: abbr.includes('pl.'),
  };
}

function parseNumeral(abbr: string): Numeral {
  const cardinal = abbr.includes('card');
  const collective = abbr.includes('coll');
  const differential = abbr.includes('diff');
  const fractional = abbr.includes('fract');
  const multiplicative = abbr.includes('mult');
  const ordinal = abbr.includes('ord');
  const substantivized = abbr.includes('subst');

  const numeralType = collective
    ? 'collective'
    : differential
    ? 'differential'
    : fractional
    ? 'fractional'
    : multiplicative
    ? 'multiplicative'
    : ordinal
    ? 'ordinal'
    : substantivized
    ? 'substantivized'
    : 'cardinal';

  return {
    name: 'numeral',
    type: numeralType,
    cardinal,
    collective,
    differential,
    fractional,
    multiplicative,
    ordinal,
    substantivized,
  };
}
