// Curated Steenbergen lemma patches: [word, xpos, lemma?, xpos?, addition?].
// Kept as a module, not JSON: `tsc` does not copy .json into outDir.
export default [
  ['dělo', 'n.', null, null, '(děla/dělese)'],
  ['oči', 'f.pl.', 'oko', 'n.', '(oka/očese; pl. oči)'],
  ['uši', 'f.pl.', 'uho', 'n.', '(uha/ušese; pl. uši)'],
  ['nogavice', 'f.pl.', 'nogavica', 'f.'],
  ['onoj', 'pron.dem', 'onȯj', null, '(ona, ono)'],
  ['ona', 'pron.dem', 'onȯj', null, '(ona, ono)'],
  ['ono', 'pron.dem', 'onȯj', null, '(ona, ono)'],
  ['ta', 'pron.dem', 'tȯj', null, '(ta, to)'],
  ['to', 'pron.dem', 'tȯj', null, '(ta, to)'],
  ['ova', 'pron.dem', 'ov', null, '(ova, ovo)'],
  ['ovo', 'pron.dem', 'ov', null, '(ova, ovo)'],
  ['tamta', 'pron.dem', 'tamtȯj', null, '(tamta, tamto)'],
  ['tamto', 'pron.dem', 'tamtȯj', null, '(tamta, tamto)'],
  ['tuta', 'pron.dem', 'tutȯj', null, '(tuta, tuto)'],
  ['tuto', 'pron.dem', 'tutȯj', null, '(tuta, tuto)'],
  ['śa', 'pron.dem', 'sėj', null, '(śa, se)'],
  ['se', 'pron.dem', 'sėj', null, '(śa, se)'],

  ['nikogo', 'pron.indef', 'nikto', null],
  ['nijedna', 'pron.indef', 'nijedin', null],
  ['nijedno', 'pron.indef', 'nijedin', null],

  // Which column of the third-person table each entry declines by. `jego` and
  // `jemu` are shared by `on` and `ono`, `jih` and `jim` by `oni` and `one`;
  // the entry has to pick one, and it picks the masculine. What they are all
  // called is a separate question — see LEXEMES below.
  ['jego', 'pron.pers.', 'on', null, '(jego, jemu, njim)'],
  ['jemu', 'pron.pers.', 'on', null, '(jego, jemu, njim)'],
  ['mu', 'pron.pers.', 'on', null, '(jego, jemu, njim)'],
  ['go', 'pron.pers.', 'on', null, '(jego, jemu, njim)'],
  ['jej', 'pron.pers.', 'ona', null, '(jų, jej, njejų)'],
  ['jų', 'pron.pers.', 'ona', null, '(jų, jej, njejų)'],
  ['jih', 'pron.pers.', 'oni', null, '(jih, jim, njimi)'],
  ['jim', 'pron.pers.', 'oni', null, '(jih, jim, njimi)'],

  // First and second person keep their own lemmas — `ja` and `my` are not
  // forms of each other, their number is lexical — but their oblique entries
  // are forms all the same.
  ['mene', null, 'ja', null, '(mene/mę, mně/mi, mnojų)'],
  ['mę', null, 'ja', null, '(mene/mę, mně/mi, mnojų)'],
  ['mi', null, 'ja', null, '(mene/mę, mně/mi, mnojų)'],
  ['mně', null, 'ja', null, '(mene/mę, mně/mi, mnojų)'],
  ['tebe', null, 'ty', null, '(tebe/tę, tobě/ti, tobojų)'],
  ['tę', null, 'ty', null, '(tebe/tę, tobě/ti, tobojų)'],
  ['tobě', 'pron.pers.', 'ty', null, '(tebe/tę, tobě/ti, tobojų)'],
  ['ti', 'pron.pers.', 'ty', null, '(tebe/tę, tobě/ti, tobojų)'],
  ['nas', null, 'my', null, '(nas, nam, nami)'],
  ['nam', null, 'my', null, '(nas, nam, nami)'],
  ['vas', null, 'vy', null, '(vas, vam, vami)'],
  ['vam', null, 'vy', null, '(vas, vam, vami)'],
  ['se', 'pron.refl.', 'sebę', null, '(sę, sobě/si, sobojų)'],
  ['sę', null, 'sebę', null, '(sę, sobě/si, sobojų)'],
  ['si', 'pron.refl.', 'sebę', null, '(sę, sobě/si, sobojų)'],
  ['sobě', 'pron.refl.', 'sebę', null, '(sę, sobě/si, sobojų)'],
  ['sebe', 'pron.refl.', 'sebę', null, '(sę, sobě/si, sobojų)'],

  ['moja', null, 'moj', null, '(moja, moje)'],
  ['moje', null, 'moj', null, '(moja, moje)'],
  ['tvoja', null, 'tvoj', null, '(tvoja, tvoje)'],
  ['tvoje', null, 'tvoj', null, '(tvoja, tvoje)'],
  ['naša', null, 'naš', null, '(naša, naše)'],
  ['naše', null, 'naš', null, '(naša, naše)'],
  ['vaša', null, 'vaš', null, '(vaša, vaše)'],
  ['vaše', null, 'vaš', null, '(vaša, vaše)'],
  ['svoja', null, 'svoj', null, '(svoja, svoje)'],
  ['svoje', null, 'svoj', null, '(svoja, svoje)'],

  ['vśa', null, 'vėś', null, '(vśa, vśe)'],
  ['vśe', null, 'vėś', null, '(vśa, vśe)'],
  ['vse', null, 'vėś', null, '(vśa, vśe)'],
  ['žadna', null, 'žadėn', null, '(žadna, žadno)'],
  ['žadno', null, 'žadėn', null, '(žadna, žadno)'],
  ['čija', null, 'čij', null, '(čija, čije)'],
  ['čije', null, 'čij', null, '(čija, čije)'],

  ['byti', null, 'byti', 'v.aux. ipf.'],
  ['jesm', null, 'byti', 'v.aux. ipf.'],
  ['bųde/bųdųt', null, 'byti', 'v.aux. ipf.'],
  ['sųt', null, 'byti', 'v.aux. ipf.'],

  ['hotěti', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['htěti', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['iměti', 'v.aux. ipf.', null, 'v.tr. ipf.'],
  ['imati', 'v.aux. ipf.', null, 'v.tr. ipf.'],
  ['mogti', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['morati', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['musěti', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['stavati', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['trěbovati', 'v.aux. ipf.', null, 'v.intr. ipf.'],
  ['uměti', 'v.aux. ipf.', null, 'v.tr. ipf.'],
  ['smogti', 'v.aux. pf.', null, 'v.intr. pf.'],
  ['stati', 'v.aux. pf.', null, 'v.intr. pf.'],
];

/**
 * The lexeme a headword belongs to, for the LEMMA column only — it does not
 * change which paradigm the entry declines by.
 *
 * The two are different questions and this file used to answer only the first.
 * `mene` is the same entry as `ja`, so it declines as `ja` and is called `ja`.
 * `ona` is not the same entry as `on` — it is one column of it — so it keeps
 * its own ten forms and is still called `on`, the way every Slavic treebank
 * calls it: gender and number on a third-person pronoun are agreement with
 * whatever it stands for, not a choice between four words.
 *
 * First and second person are not in here on purpose. `ja` and `my` are not
 * forms of each other — their number is lexical, it agrees with nothing.
 */
export const LEXEMES: Record<string, string> = {
  on: 'on',
  ona: 'on',
  ono: 'on',
  oni: 'on',
  one: 'on',
};
