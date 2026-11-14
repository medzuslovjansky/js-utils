import { describe, test } from 'node:test';
import assert from 'node:assert';

import { FlavorisationBCP47 } from './constants/bcp47.ts';
import { transliterate } from './transliterate.ts';

const nms = { input: 'isv-x-nms' } as const;

// Naučny Medžuslovjanski (NMS) input. Each case: input, then etymological and
// standard Latin read the default way, then the same two read as NMS.
type Case = [string, string, string, string, string];

const groups: Record<string, Case[]> = {
  // NMS `ė` is the e of *er/*el, which is `ě` here; by default `ė` is the
  // strong front yer it is in the etymological alphabet
  'ė is ě only as NMS': [
    ['vėrh', 'vėrh', 'verh', 'věrh', 'věrh'],
    ['mlėko', 'mlėko', 'mleko', 'mlěko', 'mlěko'],
    ['Brėg', 'Brėg', 'Breg', 'Brěg', 'Brěg'],
    ['dėnj', 'dėnj', 'denj', 'děnj', 'děnj'],
  ],
  // NMS `ĺ` is a syllabic l, `ȯl` here; by default it is a soft l, which is
  // how the etymological alphabet itself spells veĺmi
  'ĺ is ȯl only as NMS': [
    ['vĺk', 'vĺk', 'vlk', 'vȯlk', 'volk'],
    ['pĺny', 'pĺny', 'plny', 'pȯlny', 'polny'],
    ['veĺmi', 'veĺmi', 'velmi', 'veĺmi', 'velmi'],
    ['paĺto', 'paĺto', 'palto', 'paĺto', 'palto'],
  ],
  // only the Latin letters: a soft l that comes from Cyrillic or Glagolitic
  // is not NMS's ĺ, and the grave-accented è is not NMS's ė
  'what NMS does not re-read': [
    ['пальто', 'paĺto', 'palto', 'paĺto', 'palto'],
    ['ⱂⰰⰾⱐⱅⱁ', 'paĺto', 'palto', 'paĺto', 'palto'],
    ['рѫка', 'rųka', 'ruka', 'rųka', 'ruka'],
    ['ⱃⱘⰽⰰ', 'rųka', 'ruka', 'rųka', 'ruka'],
    ['dèn', 'dėn', 'den', 'dėn', 'den'],
    ['paľto', 'paĺto', 'palto', 'paĺto', 'palto'],
    ['vŀk', 'vȯlk', 'volk', 'vȯlk', 'volk'],
    ['czas', 'čas', 'čas', 'čas', 'čas'],
  ],
  // NMS letters that read the same either way: ı softens before j, ṱ and ḓ are the
  // consonants lost from tl, dl
  'NMS letters that read the same, flag or no flag': [
    ['znanıje', 'znańje', 'znanje', 'znańje', 'znanje'],
    ['bıj', 'bj', 'bj', 'bj', 'bj'],
    ['moḓliti', 'moliti', 'moliti', 'moliti', 'moliti'],
    ['pleṱl', 'plel', 'plel', 'plel', 'plel'],
  ],
  'other NMS letters, flag or no flag': [
    ['ĵedin', 'jedin', 'jedin', 'jedin', 'jedin'],
    ['kȯnęʒ', 'kȯnęz', 'konez', 'kȯnęz', 'konez'],
    ['otèç', 'otėc', 'otec', 'otėc', 'otec'],
    ['sòn', 'sȯn', 'son', 'sȯn', 'son'],
    ['tṙg', 'trg', 'trg', 'trg', 'trg'],
    ['moře', 'moŕe', 'more', 'moŕe', 'more'],
    ['koň', 'koń', 'kon', 'koń', 'kon'],
    ['ùtora', 'vtora', 'vtora', 'vtora', 'vtora'],
    ['œko', 'oko', 'oko', 'oko', 'oko'],
    ['dobrý', 'dobry', 'dobry', 'dobry', 'dobry'],
    ['trává', 'trava', 'trava', 'trava', 'trava'],
    ['gråd', 'gråd', 'grad', 'gråd', 'grad'],
  ],
};

describe("input: 'isv-x-nms'", () => {
  for (const [name, cases] of Object.entries(groups)) {
    describe(name, () => {
      for (const [input, etym, std, nmsEtym, nmsStd] of cases) {
        test(`${input} → ${etym} / ${std}, as NMS ${nmsEtym} / ${nmsStd}`, () => {
          assert.strictEqual(transliterate(input, 'isv-Latn-x-etymolog'), etym);
          assert.strictEqual(transliterate(input, 'isv-Latn'), std);
          assert.strictEqual(
            transliterate(input, 'isv-Latn-x-etymolog', nms),
            nmsEtym,
          );
          assert.strictEqual(transliterate(input, 'isv-Latn', nms), nmsStd);
        });
      }
    });
  }

  test('changes nothing in a text without ė and ĺ, whatever the target', () => {
    const text =
      'Рѫка, ⱃⱘⰽⰰ, Ⱄⰾⱁⰲⰺⰰⱀⰰⰿ, пальто, съмысл; czas, zxena, moře, znanıje, ' +
      'moḓliti, ĵedin, kȯnęʒ, sòn, dèn, vŀk, tṙg, koň, œko, dobrý, gråd.';

    for (const code of new Set(Object.values(FlavorisationBCP47))) {
      assert.strictEqual(
        transliterate(text, code, nms),
        transliterate(text, code),
        code,
      );
    }
  });

  // The lost consonants come back in the one flavour that has them.
  test('ṱ and ḓ are t and d in the northern flavour', () => {
    for (const options of [undefined, nms]) {
      assert.strictEqual(
        transliterate('moḓliti pleṱl', 'isv-Latn-x-northern', options),
        'modliti pletl',
      );
    }
  });
});
