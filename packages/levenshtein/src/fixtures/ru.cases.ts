import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // adjective -ый/-ий is ISV -y/-i; -ий only after velars/hushers (ы is not
    // written there), so loan nouns keep it (гений→genij); short words are guarded
    { in: 'бедный', out: 'bedny', covers: 'ru-adj' },
    { in: 'тихий', out: 'tihi', covers: 'ru-adj' },
    { in: 'гений', out: 'genij', covers: 'ru-adj' },
    { in: 'кий', out: 'kij', covers: 'ru-adj' },
    // pleophony folds to the ISV metathesis reflex; å stays a grapheme
    { in: 'город', out: 'gråd', covers: 'pleophony' },
    { in: 'голова', out: 'glåva', covers: 'pleophony' },
    { in: 'берёза', out: 'brěza', covers: 'pleophony' },
    // еле is not folded (loans, зелёный)
    { in: 'телефон', out: 'telefon', covers: 'pleophony' },
    // dictionary stress marks are not segments (Wiktionary: бо́гом)
    { in: 'бо́гом', out: 'bogom', covers: 'prosody' },
    // the breve of й is a letter, not a stress mark
    { in: 'бо́йня', out: 'bojnja', covers: 'prosody' },
    { in: 'единство', out: 'jedinstvo', covers: 'ru-je' },
    { in: 'тюрма', out: 'tjurma', covers: 'cyrillic-base' },
    { in: 'конь', out: 'konj', covers: 'cyrillic-base' },
    { in: 'судья', out: 'sudja', covers: 'cyrillic-base' },
    { in: 'съезд', out: 'sjezd', covers: 'cyrillic-base' },
    // ё after ф is a genuinely soft consonant ([ʂɐˈfʲɵr]); the husher rules must not touch it
    { in: 'шофёр', out: 'šofjor', covers: 'cyrillic-base' },
    { in: 'щука', out: 'ščuka', covers: 'cyrillic-base' },
    // ж ч ш щ are unpaired for palatalization: final ь after them is pure orthography
    { in: 'ночь', out: 'noč', covers: 'ru-hushers-soft-sign' },
    { in: 'ешь', out: 'ješ', covers: 'ru-hushers-soft-sign' },
    // ь before an iotated vowel must survive to feed the base composites
    { in: 'ночью', out: 'nočju', covers: 'ru-hushers-soft-sign' },
    { in: 'чьи', out: 'čji', covers: 'ru-hushers-soft-sign' },
    // after hushers the iotated ё/ю carry no glide
    { in: 'шёпот', out: 'šopot', covers: 'ru-hushers-glide' },
    { in: 'парашют', out: 'parašut', covers: 'ru-hushers-glide' },
    { in: 'жюри', out: 'žuri', covers: 'ru-hushers-glide' },
  ],
  metric: [
    { isv: 'bědny', other: 'бедный', max: THRESHOLDS.LOW },
    { isv: 'kråva', other: 'корова', max: THRESHOLDS.LOW },
    { isv: 'brěg', other: 'берег', max: THRESHOLDS.LOW },
    { isv: 'voda', other: 'вода', max: THRESHOLDS.LOW },
    { isv: 'člověk', other: 'человек', max: THRESHOLDS.LOW },
    { isv: 'konj', other: 'конь', max: THRESHOLDS.LOW },
    { isv: 'tjurma', other: 'тюрьма', max: THRESHOLDS.LOW },
    { isv: 'noč', other: 'ночь', max: THRESHOLDS.LOW },
    { isv: 'govoriti', other: 'говорить', max: THRESHOLDS.LOW },
    { isv: 'pes', other: 'кошка', min: THRESHOLDS.HIGH },
    { isv: 'ryba', other: 'стол', min: THRESHOLDS.HIGH },
  ],
};
