import {
  transliterate as _transliterate,
  FlavorizationType,
  TransliterationType,
} from './transliterate';

import { FlavorisationBCP47Code } from '../constants';

export default function transliterate(
  text: string,
  lang: FlavorisationBCP47Code,
  preprocessed = false,
): string {
  switch (lang) {
    case 'isv-Latn':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Standard,
        preprocessed,
      );
    case 'isv-Cyrl':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Standard,
        preprocessed,
      );
    case 'isv-Glag':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Standard,
        preprocessed,
      );
    case 'isv-x-fonipa':
      return _transliterate(
        text,
        TransliterationType.IPA,
        FlavorizationType.Etymological,
        preprocessed,
      );
    case 'isv-Latn-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Etymological,
        preprocessed,
      );
    case 'isv-Cyrl-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Etymological,
        preprocessed,
      );
    case 'isv-Glag-x-etymolog':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Etymological,
        preprocessed,
      );
    case 'isv-Cyrl-x-iotated':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.Standard,
        preprocessed,
      );
    case 'isv-Cyrl-x-iotated-ext':
      return _transliterate(
        text,
        TransliterationType.TraditionalIotatedCyrillic,
        FlavorizationType.CyrillicExtended,
        preprocessed,
      );
    case 'isv-Cyrl-x-northern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Northern,
        preprocessed,
      );
    case 'isv-Cyrl-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Slovianto,
        preprocessed,
      );
    case 'isv-Cyrl-x-southern':
      return _transliterate(
        text,
        TransliterationType.StandardCyrillic,
        FlavorizationType.Southern,
        preprocessed,
      );
    case 'isv-Latn-PL':
      return _transliterate(
        text,
        TransliterationType.Polish,
        FlavorizationType.Etymological,
        preprocessed,
      );
    case 'isv-Latn-x-ascii':
      return _transliterate(
        text,
        TransliterationType.ASCII,
        FlavorizationType.Standard,
        preprocessed,
      );
    case 'isv-Latn-x-northern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Northern,
        preprocessed,
      );
    case 'isv-Latn-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Slovianto,
        preprocessed,
      );
    case 'isv-Latn-x-southern':
      return _transliterate(
        text,
        TransliterationType.Latin,
        FlavorizationType.Southern,
        preprocessed,
      );
    case 'isv-Glag-x-northern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Northern,
        preprocessed,
      );
    case 'isv-Glag-x-southern':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Southern,
        preprocessed,
      );
    case 'isv-Glag-x-sloviant':
      return _transliterate(
        text,
        TransliterationType.Glagolitic,
        FlavorizationType.Slovianto,
        preprocessed,
      );
    case 'isv':
      return text;
    default:
      throw new TypeError(`Unsupported IETF BCP47 tag: ${lang}`);
  }
}
