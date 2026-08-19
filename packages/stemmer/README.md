# @interslavic/stemmer
 
Interslavic stemmer and full-text search integration. Includes a script-agnostic stemmer, tokenizer, trimmer, and plugin for [lunr](https://lunrjs.com) to support cross-script searching (e.g. matching `pesok` against `pěsȯk` and Cyrillic text).
 
```bash
npm install @interslavic/stemmer lunr
```
 
### Direct Stemming
 
```js
import { stem } from '@interslavic/stemmer';
 
stem('domami'); // 'dom'
stem('домами'); // 'dom'
```
 
### Lunr Integration
 
```js
import lunr from 'lunr';
import { registerLunr } from '@interslavic/stemmer/lunr';
 
registerLunr(lunr);
 
const index = lunr(function () {
  this.use(lunr.isv);
  this.ref('id');
  this.field('text');
  documents.forEach((doc) => this.add(doc));
});
 
index.search('medzuslovjanski'); // finds «Medžuslovjansky» and «Меджусловјанскы»
```
 
## Lunr Tokenizer and Trimmer
 
Default Lunr trimming discards non-ASCII characters, stripping Interslavic diacritics and Cyrillic text. `registerLunr` configures Unicode-aware tokenization and trimming for Lunr.
 
## Processing Pipeline
 
Stemming consists of two stages:
 
**1. Folding.** Normalizes all scripts to standard Latin base characters. Cyrillic and Glagolitic are converted via `@interslavic/translit`, ASCII digraphs are decoded (`zsena` → `žena`), etymological diacritics are stripped (`råzum` → `razum`), and northern glides are unified (`slovianski` → `slovjanski`). Spellings that contrast `ě` and `je`/`ie` (e.g. `ěsti` vs `jesti`) are retained without destructive folding.
 
**2. Stemming.** Strips endings using longest-suffix matching against `src/endings.ts`. The resulting stem serves strictly as a search index key rather than a grammatical lemma. Suffixes are mined directly from `@interslavic/morphology` paradigms to optimize classification across overlapping inflection patterns while avoiding over-stemming unrelated roots.
 
Stop words are filtered after stemming to match all inflected forms against a single stem list.
 
## Evaluation and Tuning
 
The stemmer is benchmarked against ~16,000 lemmas and ~200,000 generated forms from `@interslavic/morphology`:
 
```bash
yarn workspace @interslavic/dev-stembench bench
yarn workspace @interslavic/dev-stembench bench --splits --collisions
yarn workspace @interslavic/dev-stembench bench --holdout
```
 
Evaluation uses the F1 score (harmonic mean of form recall and root precision). The `--holdout` flag trains on half the vocabulary and evaluates on the unseen half to verify generalization.
 
`--splits` lists fragmented paradigms; `--collisions` lists colliding unrelated stems. Rules and stop words can be regenerated via:
 
```bash
yarn workspace @interslavic/dev-stembench learn
yarn workspace @interslavic/dev-stembench stopwords
```
 
## Exports
 
`fold(word)` and `stem(word)` for direct usage, plus `trimmer`, `stemmer`, `stopWordFilter`, and `SEPARATOR` for custom pipelines.
