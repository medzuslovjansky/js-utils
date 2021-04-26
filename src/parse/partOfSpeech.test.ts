import parsePartOfSpeech from './partOfSpeech';
import { PartOfSpeech } from '../types';

type ParseTestTuple = [input: string, expected: Partial<PartOfSpeech>];

describe('parsePartOfSpeech', () => {
  test.each([
    ['adj.', { name: 'adjective' }],
    ['adv.', { name: 'adverb' }],
    ['conj.', { name: 'conjunction' }],
    ['f.', { name: 'noun', feminine: true }],
    ['f.indecl.', { name: 'noun', feminine: true, indeclinable: true }],
    ['f.pl.', { name: 'noun', feminine: true, plural: true }],
    ['f.sg.', { name: 'noun', feminine: true, singular: true }],
    ['intj.', { name: 'interjection' }],
    ['m.', { name: 'noun', masculine: true }],
    ['m./f.', { name: 'noun', masculine: true, feminine: true }],
    ['m.anim.', { name: 'noun', masculine: true, animate: true }],
    ['m.indecl.', { name: 'noun', masculine: true, indeclinable: true }],
    ['m.pl.', { name: 'noun', masculine: true, plural: true }],
    ['m.sg.', { name: 'noun', masculine: true, singular: true }],
    ['n.', { name: 'noun', neuter: true }],
    ['n.indecl.', { name: 'noun', neuter: true, indeclinable: true }],
    ['n.pl.', { name: 'noun', neuter: true, plural: true }],
    ['n.sg.', { name: 'noun', neuter: true, singular: true }],
    ['noun indecl.', { name: 'noun', indeclinable: true }],
    ['num.', { name: 'numeral' }],
    ['num.card.', { name: 'numeral', cardinal: true }],
    ['num.coll.', { name: 'numeral', collective: true }],
    ['num.diff.', { name: 'numeral', differential: true }],
    ['num.fract.', { name: 'numeral', fractional: true }],
    ['num.mult.', { name: 'numeral', multiplicative: true }],
    ['num.ord.', { name: 'numeral', ordinal: true }],
    ['num.subst.', { name: 'numeral', substantivized: true }],
    ['particle', { name: 'particle' }],
    ['phrase', { name: 'phrase' }],
    ['prefix', { name: 'prefix' }],
    ['prep.', { name: 'preposition' }],
    ['pron.dem.', { name: 'pronoun', demonstrative: true }],
    ['pron.indef.', { name: 'pronoun', indefinite: true }],
    ['pron.int.', { name: 'pronoun', intensive: true }],
    ['pron.pers.', { name: 'pronoun', personal: true }],
    ['pron.poss.', { name: 'pronoun', possessive: true }],
    ['pron.rec.', { name: 'pronoun', reciprocal: true }],
    ['pron.refl.', { name: 'pronoun', reflexive: true }],
    ['pron.rel.', { name: 'pronoun', relative: true }],
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
    ['#v.tr.ipf', { name: 'verb', transitive: true, imperfective: true }],
  ] as ParseTestTuple[])(
    'should expand %j to object',
    (abbr: ParseTestTuple[0], expected: ParseTestTuple[1]) => {
      const actual = parsePartOfSpeech(abbr);
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
    expect(() => parsePartOfSpeech(null as any)).toThrowErrorMatchingSnapshot();
  });

  it('should throw for unknown abbreviations', () => {
    expect(() => parsePartOfSpeech('unknown')).toThrowErrorMatchingSnapshot();
  });
});
