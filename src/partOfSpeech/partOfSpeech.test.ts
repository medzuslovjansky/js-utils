import { parsePos } from './partOfSpeech';
import { PartOfSpeech } from './types';

type ParseTestTuple = [input: string, expected: Partial<PartOfSpeech>];

describe('parsePos', () => {
  test.each([
    ['adj.', { name: 'adjective' }],
    ['adv.', { name: 'adverb' }],
    ['conj.', { name: 'conjunction' }],
    ['f.', { name: 'noun', gender: 'feminine', feminine: true }],
    [
      'f.indecl.',
      { name: 'noun', gender: 'feminine', feminine: true, indeclinable: true },
    ],
    [
      'f.pl.',
      { name: 'noun', gender: 'feminine', feminine: true, plural: true },
    ],
    [
      'f.sg.',
      { name: 'noun', gender: 'feminine', feminine: true, singular: true },
    ],
    ['intj.', { name: 'interjection' }],
    ['m.', { name: 'noun', gender: 'masculine', masculine: true }],
    [
      'm./f.',
      {
        name: 'noun',
        gender: 'masculineOrFeminine',
        masculine: true,
        feminine: true,
      },
    ],
    [
      'm.anim.',
      { name: 'noun', gender: 'masculine', masculine: true, animate: true },
    ],
    [
      'm.indecl.',
      {
        name: 'noun',
        gender: 'masculine',
        masculine: true,
        indeclinable: true,
      },
    ],
    [
      'm.pl.',
      { name: 'noun', gender: 'masculine', masculine: true, plural: true },
    ],
    [
      'm.sg.',
      { name: 'noun', gender: 'masculine', masculine: true, singular: true },
    ],
    ['n.', { name: 'noun', gender: 'neuter', neuter: true }],
    [
      'n.indecl.',
      { name: 'noun', gender: 'neuter', neuter: true, indeclinable: true },
    ],
    ['n.pl.', { name: 'noun', gender: 'neuter', neuter: true, plural: true }],
    ['n.sg.', { name: 'noun', gender: 'neuter', neuter: true, singular: true }],
    ['noun indecl.', { name: 'noun', indeclinable: true }],
    ['num.', { name: 'numeral' }],
    ['num.card.', { name: 'numeral', type: 'cardinal', cardinal: true }],
    ['num.coll.', { name: 'numeral', type: 'collective', collective: true }],
    [
      'num.diff.',
      { name: 'numeral', type: 'differential', differential: true },
    ],
    ['num.fract.', { name: 'numeral', type: 'fractional', fractional: true }],
    [
      'num.mult.',
      { name: 'numeral', type: 'multiplicative', multiplicative: true },
    ],
    ['num.ord.', { name: 'numeral', type: 'ordinal', ordinal: true }],
    [
      'num.subst.',
      { name: 'numeral', type: 'substantivized', substantivized: true },
    ],
    ['particle', { name: 'particle' }],
    ['phrase', { name: 'phrase' }],
    ['prefix', { name: 'prefix' }],
    ['prep.', { name: 'preposition' }],
    [
      'pron.dem.',
      { name: 'pronoun', type: 'demonstrative', demonstrative: true },
    ],
    ['pron.indef.', { name: 'pronoun', type: 'indefinite', indefinite: true }],
    [
      'pron.int.',
      { name: 'pronoun', type: 'interrogative', interrogative: true },
    ],
    ['pron.pers.', { name: 'pronoun', type: 'personal', personal: true }],
    ['pron.poss.', { name: 'pronoun', type: 'possessive', possessive: true }],
    ['pron.rec.', { name: 'pronoun', type: 'reciprocal', reciprocal: true }],
    ['pron.refl.', { name: 'pronoun', type: 'reflexive', reflexive: true }],
    ['pron.rel.', { name: 'pronoun', type: 'relative', relative: true }],
    ['suffix', { name: 'suffix' }],
    ['v. ipf.', { name: 'verb', imperfective: true }],
    ['v.aux. ipf.', { name: 'verb', auxiliary: true, imperfective: true }],
    ['v.aux. pf.', { name: 'verb', auxiliary: true, perfective: true }],
    ['v.intr. ipf.', { name: 'verb', intransitive: true, imperfective: true }],
    [
      'v.intr. ipf./pf.',
      {
        name: 'verb',
        intransitive: true,
        imperfective: true,
        perfective: true,
      },
    ],
    ['v.intr. pf.', { name: 'verb', intransitive: true, perfective: true }],
    ['v.ipf.', { name: 'verb', imperfective: true }],
    ['v.pf.', { name: 'verb', perfective: true }],
    ['v.refl. ipf.', { name: 'verb', reflexive: true, imperfective: true }],
    [
      'v.refl. ipf./pf.',
      { name: 'verb', reflexive: true, imperfective: true, perfective: true },
    ],
    ['v.refl. pf.', { name: 'verb', reflexive: true, perfective: true }],
    ['v.tr. ipf.', { name: 'verb', transitive: true, imperfective: true }],
    [
      'v.tr. ipf./pf.',
      { name: 'verb', transitive: true, imperfective: true, perfective: true },
    ],
    ['v.tr. pf.', { name: 'verb', transitive: true, perfective: true }],
    ['v.tr.ipf', { name: 'verb', transitive: true, imperfective: true }],
  ] as ParseTestTuple[])(
    'should expand %j to object',
    (abbr: ParseTestTuple[0], expected: ParseTestTuple[1]) => {
      const actual = parsePos(abbr);
      if (!actual) {
        fail('should have returned non-null');
      }

      const pattern: any = { ...expected };
      for (const aKey of Object.keys(actual)) {
        const key: keyof PartOfSpeech = aKey as any;
        if (typeof actual[key] === 'boolean' && !(key in pattern)) {
          pattern[key] = false;
        }
      }

      expect(actual).toMatchObject(pattern);
    },
  );

  it('should throw for non-strings', () => {
    expect(() => parsePos(null as any)).toThrowErrorMatchingInlineSnapshot(
      '"Expected a string, but got: null"',
    );
  });

  it('should throw for unknown abbreviations', () => {
    expect(() => parsePos('unknown')).toThrowErrorMatchingInlineSnapshot(
      '"Failed to parse the part of speech in: unknown"',
    );
  });
});
