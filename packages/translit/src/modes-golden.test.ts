import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { FlavorisationBCP47 } from './constants/bcp47.ts';
import { transliterate } from './transliterate.ts';

const snap = snapshots(import.meta.filename);

/**
 * What `transliterate(text, lang, <third argument>)` returned before the third
 * argument became an options object, for every target and both input modes.
 *
 * The words are made up for this file, one group per kind of input the
 * normalizer has rules for. The exhaustive nets (every letter pair, every
 * paradigm form, every short Glagolitic word) live in `tools/dump`; this one is
 * small enough to read, and runs with the package's own tests.
 */
const SAMPLE: Record<string, string> = {
  glagolitic:
    'ⰳⱁⱃⰰ ⱄⱅⱁⰾⱏ ⰴⱘⰱⱏ ⰲⱏ ⱄⱏ ⰽⱏ ⱄⱏⱀⱏ ⱂⱐⱄⱏ ⰴⱐⱀⱐ ⰿⱖⰴⱏ ⰱⱐⰹⰽⱏ ⱅⱏⱃⰳⱏ ⱏ ⱐ ⰸⰺ҃ ⰰ҃ ' +
    'ⱃⰰⰱⱁⱅⰰ Ⰳⱁⱃⰰ ⰃⰑⰓⰀ ⰽⱁⱀⱐ ⰽⱏⱀⰻⰳⰰ ⱎⱋⰻⱅⱏ ⱑⰸⰴⰰ ⱗⰸⱏⰹⰽⱏ ⱙⰶⰵ ⱓⰳⱏ ⱝⰱⰾⱏⰽⱁ',
  cyrillic:
    'дубъ въ съ къ сънъ объявити конь день пять ъ ь моя любов кнѧзь рѫка ' +
    'ѥзык њива ђак щит Дубъ ДУБЪ подъѥзд мѣсто ѩзык твоѭ ꙗблоко людьи ' +
    'ћуд ѕвѣзда џем ґанок это єсть ꙁима мѵро ѷ ѡтьц ѳома ѹхо ȣста рꙑба ' +
    'коў ѱалом ѯения грӑд зь рь семья',
  'latin with yers': 'dųbъ dǫbъ avъtomatičьnǫ vъ konь dьnь sъnъ',
  'NMS letters':
    'vėrh dėnj vĺk veĺmi pĺny ı znanıje bıj moḓliti pleṱl ĵedin kŭnęʒ otėç ' +
    'sòn dèn vŀk tṙg moře koň ùtora œko dobrý nítj trává lés mìr gråd',
  'other accents': 'àâā îīĭ úûůū ąǫũ ēĕë ôŏö łļǉ ñņǌ d́en t́ma póle bê žêna',
  'ASCII digraphs':
    'sxiroky szum szadu bezsilny razsuditi vozsxestvie obezsiliti råzsuditi ' +
    'vȯzstati izsxel cxas czas zxena zsena ye vyera quadrat q aqua chata ' +
    'woda xerox wifi Wifi konjugacija konjunktiv injekcija roż mazsk izstok',
  'soft y': 'jy ćy đy šy žy čy jj mojý',
  'digits and punctuation': 'God 2026, 19 knig; 7. A1 «da» — ne!',
};

/** The third argument of `transliterate`, by the name the snapshot uses. */
const MODES = {
  forgiving: undefined,
  strict: { input: 'isv-x-etymolog' },
} as const;

describe('transliterate, both input modes, every target', () => {
  for (const [mode, third] of Object.entries(MODES)) {
    for (const code of [...new Set(Object.values(FlavorisationBCP47))].sort()) {
      test(`${mode} ${code}`, (t) => {
        const lines = Object.entries(SAMPLE).map(
          ([group, text]) =>
            `${group}: ${text}\n  → ${transliterate(text, code, third)}`,
        );

        snap.match(t, `modes golden ${mode} ${code}`, lines.join('\n'));
      });
    }
  }
});
