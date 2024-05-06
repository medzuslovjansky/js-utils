import {
  transliterate as _transliterate,
  FlavorizationType,
  TransliterationType,
} from './transliterate';

import { FlavorisationBCP47Code } from '../constants';

export default function transliterate(
  text: string,
  lang: FlavorisationBCP47Code,
): string {
  switch (lang) {
    case 'isv-Latn':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Standard,
      );
    case 'isv-Cyrl':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Standard,
      );
    case 'isv-Glag':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Standard,
      );
    case 'isv-x-fonipa':
      return _transliterate(
        text,
        TransliterationType.IPA,
        FlavorizationType.Etymological,
      );
    case 'isv-Latn-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Etymological,
      );
    case 'isv-Cyrl-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Etymological,
      );
    case 'isv-Glag-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Etymological,
      );
    case 'isv-Cyrl-x-iotated':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.Standard,
      );
    case 'isv-Cyrl-x-iotated-ext':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.CyrillicExtended,
      );
    case 'isv-Cyrl-x-northern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Northern,
      );
    case 'isv-Cyrl-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Slovianto,
      );
    case 'isv-Cyrl-x-southern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Southern,
      );
    case 'isv-Latn-PL':
      return _transliterate(
        text,
        TransliterationType.Polish,
        FlavorizationType.Etymological,
      );
    case 'isv-Latn-x-ascii':
      return _transliterate(
        text,
        TransliterationType.ASCII,
        FlavorizationType.Standard,
      );
    case 'isv-Latn-x-northern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Northern,
      );
    case 'isv-Latn-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Slovianto,
      );
    case 'isv-Latn-x-southern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Southern,
      );
    case 'isv-Glag-x-northern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Northern,
      );
    case 'isv-Glag-x-southern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Southern,
      );
    case 'isv-Glag-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Slovianto,
      );
    case 'isv':
      return text;
    default:
      throw new TypeError(`Unsupported IETF BCP47 tag: ${lang}`);
  }
}
