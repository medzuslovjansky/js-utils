/**
 * Atomic morphological features. One type per UD feature, named after it, so
 * the documentation is always https://universaldependencies.org/u/feat/<Name>.html
 * — except the two `[psor]` ones, whose links are spelled out below.
 *
 * Values are narrowed to what Interslavic actually needs, not to the full UD
 * inventory: `Gender` has no `Com`, `Aspect` no `Prog`, and so on.
 */

export type Animacy = 'Inan' | 'Anim' | 'Hum' | 'Nhum';

export type Abbr = 'Yes';

export type Case = 'Nom' | 'Acc' | 'Gen' | 'Dat' | 'Ins' | 'Loc' | 'Voc';

export type Number = 'Sing' | 'Dual' | 'Plur' | 'Ptan' | 'Coll' | 'Count';

export type PronType =
  | 'Prs'
  | 'Dem'
  | 'Int'
  | 'Rel'
  | 'Ind'
  | 'Neg'
  | 'Tot'
  | 'Rcp'
  | 'Art'
  | 'Emp'
  | 'Exc';

export type NumType =
  'Card' | 'Ord' | 'Mult' | 'Frac' | 'Sets' | 'Range' | 'Dist';

export type Reflex = 'Yes';

export type Poss = 'Yes';

export type Analyt = 'Yes';

export type Degree = 'Pos' | 'Cmp' | 'Sup';

export type Gender = 'Masc' | 'Fem' | 'Neut';

/** `Gender[psor]` — @see https://universaldependencies.org/u/feat/Gender-psor.html */
export type PossessorGender = 'Masc,Neut' | 'Fem';

/** `Number[psor]` — @see https://universaldependencies.org/u/feat/Number-psor.html */
export type PossessorNumber = 'Sing' | 'Plur';

export type Variant = 'Long' | 'Short' | 'Athematic';

/**
 * Which environment a third-person pronoun's form belongs to: `Pre` after a
 * preposition, `Npr` everywhere else. Neither is the general form — `jego` is
 * ungrammatical in `do njego` and `njego` is ungrammatical without one — so
 * both members carry a value.
 *
 * @see https://universaldependencies.org/u/feat/PrepCase.html
 */
export type PrepCase = 'Npr' | 'Pre';

export type Polarity = 'Pos' | 'Neg';

export type Person = '1' | '2' | '3';

export type Tense = 'Pres' | 'Past' | 'Imp' | 'Fut';

export type Aspect = 'Imp' | 'Iter' | 'Perf';

export type Voice = 'Act' | 'Pass';

export type Mood = 'Ind' | 'Imp' | 'Cond';

export type VerbForm = 'Inf' | 'Fin' | 'Conv' | 'Part' | 'Vnoun';

export type Uninflect = 'Yes' | 'No';

export type Style =
  'Arch' | 'Coll' | 'Expr' | 'Form' | 'Rare' | 'Slng' | 'Vrnc' | 'Vulg';

export type Typo = 'Yes';
