import { declineNounSimple } from './noun/index.ts';
import { declineAdjective } from './adjective/index.ts';
import { conjugateVerb } from './verb/index.ts';

/**
 * Every distinct form a paradigm holds, order and features discarded.
 *
 * The point is coverage rather than annotation: it answers "does the engine
 * still know this word" for callers comparing two implementations, which is
 * the one question a flat list can answer honestly.
 */
function forms(cells: Iterable<Array<{ form: string }> | null | undefined>) {
  const seen = new Set<string>();
  for (const cell of cells) {
    for (const { form } of cell ?? []) if (form) seen.add(form);
  }
  return [...seen];
}

export function nounForms(
  lemma: string,
  morphology: string,
  extra = '',
  genderOverride?: 'masculine' | 'feminine',
): string[] {
  const paradigm = declineNounSimple(lemma, morphology, extra, genderOverride);
  if (!paradigm) return [];

  // Named rather than swept up with `Object.values`: the paradigm also carries
  // a note about itself, which is not a case and holds no forms.
  return forms(
    [
      paradigm.nom,
      paradigm.acc,
      paradigm.gen,
      paradigm.loc,
      paradigm.dat,
      paradigm.ins,
      paradigm.voc,
    ].flat(),
  );
}

export function adjectiveForms(
  adj: string,
  postfix = '',
  partOfSpeech?: string,
): string[] {
  const { singular, plural, short, comparison } = declineAdjective(
    adj,
    postfix,
    partOfSpeech,
  );

  return forms([
    ...Object.values(singular).flat(),
    ...Object.values(plural).flat(),
    short ? [{ form: short }] : null,
    ...Object.values(comparison)
      .flat()
      .map((form) => [{ form }]),
  ]);
}

export function verbForms(
  inf: string,
  rawPts: string,
  partOfSpeech?: string,
): string[] {
  const paradigm = conjugateVerb(inf, rawPts, partOfSpeech);
  if (!paradigm) return [];

  const { infinitive, present, imperfect, imperative, lparticiple } = paradigm;

  return forms([
    infinitive,
    ...present,
    ...imperfect,
    ...imperative,
    lparticiple,
  ]);
}
