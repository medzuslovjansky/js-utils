import {
  transliterate as _transliterate,
  FlavorizationType,
  TransliterationType,
} from './transliterate';

import { FlavorisationBCP47Code } from '../constants';

export function transliterate(
  text: string,
  lang: FlavorisationBCP47Code,
): string {
  switch (lang) {
    case 'art-Latn-x-interslv':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Standard,
      );
    case 'art-Cyrl-x-interslv':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Standard,
      );
    case 'art-Glag-x-interslv':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Standard,
      );
    case 'art-x-interslv-fonipa':
      return _transliterate(
        text,
        TransliterationType.IPA,
        FlavorizationType.Etymological,
      );
    case 'art-Latn-x-interslv-etym':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Etymological,
      );
    case 'art-Cyrl-x-interslv-etym':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Etymological,
      );
    case 'art-Glag-x-interslv-etym':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Etymological,
      );
    case 'art-Cyrl-x-interslv-iotated':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.Standard,
      );
    case 'art-Cyrl-x-interslv-iotated-ext':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.CyrillicExtended,
      );
    case 'art-Cyrl-x-interslv-northern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Northern,
      );
    case 'art-Cyrl-x-interslv-sloviant':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Slovianto,
      );
    case 'art-Cyrl-x-interslv-southern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Southern,
      );
    case 'art-Latn-PL-x-interslv':
      return _transliterate(
        text,
        TransliterationType.Polish,
        FlavorizationType.Etymological,
      );
    case 'art-Latn-x-interslv-ascii':
      return _transliterate(
        text,
        TransliterationType.ASCII,
        FlavorizationType.Standard,
      );
    case 'art-Latn-x-interslv-northern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Northern,
      );
    case 'art-Latn-x-interslv-sloviant':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Slovianto,
      );
    case 'art-Latn-x-interslv-southern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Southern,
      );
    case 'art-Glag-x-interslv-northern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Northern,
      );
    case 'art-Glag-x-interslv-southern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Southern,
      );
    case 'art-Glag-x-interslv-sloviant':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Slovianto,
      );
    case 'art-x-interslv':
      return text;
    default:
      throw new TypeError(`Unsupported IETF BCP47 tag: ${lang}`);
  }
}
