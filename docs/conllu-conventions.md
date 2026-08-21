# CoNLL-U conventions
 
How this repository annotates Interslavic in [Universal Dependencies][ud] terms: UPOS tag mappings, morphological features, and MISC attributes.
 
The counts below come from a full expansion of the shipped lexicon (16 233 lemmas → 295 559 forms via `yarn workspace @interslavic/dev-dump dump`). They reflect current pipeline output.
 
[ud]: https://universaldependencies.org/
 
## Pipeline
 
```
Steenbergen row  →  normalize()  →  inflect()  →  Token[]  →  formatTokens()
 id, isv, pos                                     @interslavic/conllu
```
 
`@interslavic/conllu` defines the token schema, feature types, and formatters. Language-specific mappings (UPOS tags, morphological features) live in `@interslavic/morphology` (primarily `parse-xpos.ts` and adapters).
 
## Token mapping semantics
 
`inflect()` returns the forms of a single lemma rather than a parsed utterance:
 
* **ID** is a sequential index across the paradigm assigned by the formatter when not present.
* **HEAD**, **DEPREL**, and **DEPS** default to `_` (no syntactic relations).
* Dumped blocks include `# sent_id`, `# text`, and `# xpos` comments representing the lemma, formatting the lexicon for grep and UD tooling.
 
Inflection snapshots print five columns (FORM, LEMMA, UPOS, XPOS, FEATS) to keep diffs readable by omitting empty or redundant columns. This test helper is in `packages/morphology/src/__utils__/conllufy.ts`.

## Columns

| Column | What goes in it |
|---|---|
| FORM | the inflected form, after `etymologify()` (see [Normalization](#normalization)) |
| LEMMA | citation form, normalized the same way |
| UPOS | see [UPOS mapping](#upos-mapping) |
| XPOS | raw Steenbergen part-of-speech string verbatim (`m.`, `v.tr. ipf.`, `adj.`, `pron.refl.`) |
| FEATS | see [Features](#features) |
| MISC | see [MISC](#misc) |

XPOS is preserved verbatim from the source as provenance. The `#` prefix is stripped during parsing but retained in CoNLL-U output.

```
1	Vltava	Vltava	PROPN	m.	Case=Nom|Gender=Masc|Number=Sing	_	_	_	SID=1
2	vidějų	viděti	VERB	v.tr. ipf.	Aspect=Imp|Mood=Ind|Number=Sing|Person=1|Tense=Pres|Variant=Long|VerbForm=Fin	_	_	_	SID=2
3	sę	sebę	PRON	pron.refl.	Case=Acc|PronType=Prs|Reflex=Yes|Variant=Short	_	_	_	SID=3
```

## UPOS mapping

`parseXPos(lemma, xpos)` returns an array of `[UPOS, features]` to support multi-lemma tags. It accepts the lemma for the adjective short-form rule.

| Steenbergen tag | UPOS | Notes |
|---|---|---|
| `m.` `f.` `n.` | NOUN | |
| `m./f.` | NOUN ×2 | two results, `Gender=Masc` and `Gender=Fem` |
| `m.anim./f.` | NOUN ×2 | two results (`Gender=Masc|Animacy=Anim` and `Gender=Fem`) |
| `…propn.` | PROPN | on any noun tag (`m.propn.`, `m.anim.propn.`, `f.pl.propn.`) |
| `v.` … | VERB | AUX when the tag contains `aux`; participles (`v.prap.`, `v.prpp.`, `v.pfap.`, `v.pfpp.`, `v.part.`) are `VerbForm=Part` |
| `adj.` | ADJ | |
| `adv.` | ADV | |
| `prep.` | ADP | |
| `conj.` | CCONJ | dictionary does not distinguish SCONJ |
| `intj.` | INTJ | |
| `particle` | PART | |
| `num.card.` | NUM | `NumType=Card` |
| `num.ord.` `num.mult.` `num.diff.` | ADJ | `NumType=Ord` / `Mult` / `Dist` |
| `num.subst.` `num.fract.` | NOUN | `num.fract.` adds `NumType=Frac` |
| `pron.pers.` `.refl.` `.int.` `.rel.` `.indef.` `.rec.` `.neg.` | PRON | with the matching `PronType` |
| `pron.poss.` `pron.dem.` `pron.tot.` `pron.univ.` | **DET** | UD puts pronominal modifiers in DET |
| `phrase` `prefix` `suffix` | X | not inflectable; `inflect()` returns nothing for them |
| anything else | X | |

Three UPOS decisions diverge from raw dictionary tags:

**Participles and Verbal Nouns (Masdars).** In accordance with Universal Dependencies conventions:
- Participles (`v.prap.`, `v.prpp.`, `v.pfap.`, `v.pfpp.`) are non-finite verb forms with `UPOS=VERB` and `VerbForm=Part` (with `Voice=Act`/`Pass` and `Tense=Pres`/`Past`).
- Verbal nouns (masdars / gerunds) derived from verbs are neuter nouns with `UPOS=NOUN`, `Gender=Neut`, and `VerbForm=Vnoun`.

**`propn.` → PROPN.** Maps to `PROPN` when the explicit `propn.` modifier is present in the noun XPOS tag (e.g. `m.propn.`, `f.sg.propn.`). Capitalization is not used as a heuristic for proper nouns.

**`pron.poss.`/`dem.`/`tot.` → DET.** UD classifies pronominal modifiers of nouns as determiners (809 forms).

**`conj.` → CCONJ.** The dictionary does not distinguish coordinating and subordinating conjunctions; all map to `CCONJ`.

## Features

Features come from two places and are merged per form: `parseXPos()` supplies
what the *lemma* fixes (gender of a noun, aspect of a verb, `Uninflect=Yes`),
each paradigm module supplies what the *form* fixes (case, number, person,
tense).

### What the lexicon actually produces

| Feature | Values, by frequency |
|---|---|
| Animacy | `Anim` 27 718, `Inan` 9 278 |
| Aspect | `Imp` 50 063, `Perf` 35 351 |
| Case | `Acc` `Nom` `Dat` `Gen` `Ins` `Loc` ~28–40k each, `Voc` 15 393 |
| Degree | `Pos` 94 707, `Sup` 777, `Cmp` 341 |
| Gender | `Masc` 90 683, `Fem` 71 172, `Neut` 44 336 |
| `Gender[psor]` | `Masc,Neut` 32, `Fem` 32 |
| Mood | `Ind` 56 641, `Imp` 11 637 |
| NumType | `Ord` 992, `Card` 363, `Dist` 186, `Frac` 144, `Mult` 124, `Sets` 70 |
| Number | `Sing` 164 750, `Plur` 125 372, `Ptan` 808 |
| `Number[psor]` | `Sing` 126, `Plur` 94 |
| Person | `2` 26 507, `1` 24 929, `3` 17 570 |
| Poss | `Yes` 468 |
| PrepCase | `Pre` 196, `Npr` 161 |
| PronType | `Prs` 1 005, `Ind` 500, `Dem` 341, `Rel` 108, `Neg` 105, `Int` 80, `Tot` 31 |
| Reflex | `Yes` 59 |
| Style | `Arch` 18, `Vrnc` 9 |
| Tense | `Past` 38 790, `Pres` 33 349, `Fut` 18 |
| Uninflect | `Yes` 766 |
| Variant | `Short` 9 152, `Long` 6 301, `Athematic` 4 324 |
| VerbForm | `Fin` 68 278, `Part` 15 516, `Inf` 3 879 |
| Voice | `Act` 15 516 |

### Design choices
 
* **Pluralia tantum:** Lemmas tagged `.pl.` receive `Number=Ptan` rather than `Plur`.
* **Indeclinables:** Lemmas tagged `indecl` emit uniform paradigm forms annotated with `Uninflect=Yes`.
* **Present tense variants:** `Variant=Long`/`Short` on verbs distinguishes present conjugations (`vidějų` / `viděm`); on adjectives it denotes short forms.
* **Third person pronouns:** Third-person pronoun forms are lemmatized to `on` across genders and numbers (consistent with PDT, PDB, and SynTagRus). Distinct dictionary entries (`ona`, `oni`, `jego`) retain individual `SID` mappings while sharing the `on` lemma.
* **Prepositional pronoun forms (`PrepCase`):** Third-person pronouns after prepositions take `PrepCase=Pre` (`do njego`), while bare forms take `PrepCase=Npr` (`jego`). Clitic forms (`go`, `mu`) use `Variant=Short`. Locative forms emit only prepositional variants (`njem`, `njej`, `njih`).
* **Short adjectives:** Short form adjectives are inferred from ending patterns (`Variant=Short`), while possessive adjectives receive `Poss=Yes`.
* **Style:** `Style=Arch`/`Vrnc` is restricted to hand-crafted irregular paradigms (e.g. `byti` aorist).
* **Future tense:** `Tense=Fut` applies to auxiliary forms of `byti` (`bųdų`, `bųdeš`, etc.).
 
### Biaspectual verbs
 
Biaspectual verbs (`v. ipf./pf.`) leave `Aspect` unset because upstream lexicon tables separate biaspectual entries.
 
Covered by test case `abdikovati`.
 
### Declared but unused features
 
The `@interslavic/conllu` type inventory covers UD specifications beyond current lexicon requirements. Unused types: `Abbr`, `Analyt`, `Polarity`, `Typo`, `Aspect=Iter`, `Mood=Cond`, `Tense=Imp`, `VerbForm=Conv`, `Number=Dual`/`Coll`/`Count`, `Animacy=Hum`/`Nhum`, `PronType=Art`/`Emp`/`Exc`/`Rcp`, `NumType=Sets`/`Range`, and adverb comparative degrees.
 
Participle tags (`v.prap.`, `v.prpp.`, `v.pfap.`, `v.pfpp.`) map to `VerbForm=Part` with tense and voice. In primary inflection, verbs emit the active l-participle (`Voice=Act`), while `derive()` generates participles with `UPOS=VERB` and `VerbForm=Part`.
 
## MISC
 
The column is typed key by key in `@interslavic/conllu` (`Misc`): an
attribute not listed there is a type error, not a new string in the column.

| Key | Meaning | Set by |
|---|---|---|
| `SID` | Identity of the entry: the Steenbergen id of the source row, or `<id>-<suffix>` for a lexeme `derive()` produced | `inflect()`, passed from caller; `derive()` |
| `LID` | Steenbergen id of the row a derived lexeme descends from | `derive()`, when given a `lid` |
| `Derivation` | Which rule produced a derived lexeme, as a `DerivationCode` (`v_prap`, `adj_adv`) | `derive()` |
| `Declension` | `Adj` on a noun that is an adjective used as one (`učeny`, `prěměnna`). UPOS says `NOUN`, so nothing else records which tables the forms came from | `inflect()` |
| `SpaceAfter` | `No` where the original text had no space | `splitTokens()` |

The golden dump carries sid, lemma, form and FEATS, not MISC, so a change to
an attribute above moves snapshots and nothing else.
 
## Normalization
 
FORM and LEMMA pass through `etymologify()` to standardize etymological spelling variants:
 
* `blågoslovitì` → `blågosloviti`, `blěskaĵ` → `blěskaj`
* `crkȯv` → `cŕkȯv`
 
Reflexive pronouns canonicalize to lemma `sebę` regardless of input alias (`si`, `sobě`, `sebe`).
 
## Verification
 
Regression suites:
 
```bash
yarn workspace @interslavic/morphology test  # snapshot assertions
yarn workspace @interslavic/dev-dump test    # lexicon dump golden tests
```
 
Changes to `parse-xpos.ts` or paradigm modules update snapshots. Golden dumps verify that tagging and convention updates do not unintentionally alter generated inflections.
