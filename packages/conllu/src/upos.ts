/**
 * Universal POS tags, UD v2. Definitions are at
 * https://universaldependencies.org/u/pos/ — the examples below are ours, they
 * say which Interslavic words end up under which tag. How our XPOS strings map
 * onto these is in docs/conllu-conventions.md.
 */
export type UPOS =
  /** `veliky`, `stary`, `devety` */
  | 'ADJ'
  /** `v`, `na`, `pri` */
  | 'ADP'
  /** `dobro`, `brzo`, `mnogo` */
  | 'ADV'
  /** `by`, `sųt` */
  | 'AUX'
  /** `i`, `a`, `ili` */
  | 'CCONJ'
  /** `tȯj`, `vsaky`, `kaky` */
  | 'DET'
  /** `ah`, `oj`, `hej` */
  | 'INTJ'
  /** `trava`, `lěto`, `nož` */
  | 'NOUN'
  /** `jedin`, `dvadesęť`, `100` */
  | 'NUM'
  /** `li`, `ne`, `nehaj` */
  | 'PART'
  /** `vy`, `sebe`, `někto`, `vsečto` */
  | 'PRON'
  /** `Praga`, `Ivan`, `Atlantida` */
  | 'PROPN'
  /** `.`, `,`, `(`, `)`, `"` */
  | 'PUNCT'
  /** `ako`, `kȯgda`, `že` */
  | 'SCONJ'
  /** `$`, `%`, `§`, `©` */
  | 'SYM'
  /** `viděti`, `viděny`, `vidimy` */
  | 'VERB'
  /** unclassified */
  | 'X';
