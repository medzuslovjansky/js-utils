export const InterslavicBCP47 = {
  Generic: 'art-x-interslv',
  Latin: 'art-Latn-x-interslv',
  Cyrillic: 'art-Cyrl-x-interslv',
  Glagolitic: 'art-Glag-x-interslv',
  IPA: 'art-x-interslv-fonipa',
} as const;

export type InterslavicBCP47Code =
  (typeof InterslavicBCP47)[keyof typeof InterslavicBCP47];

export const FlavorisationBCP47 = {
  ...InterslavicBCP47,
  ASCII: 'art-Latn-x-interslv-ascii',
  LatinEtymological: 'art-Latn-x-interslv-etym',
  LatinNorthern: 'art-Latn-x-interslv-northern',
  LatinSlovianto: 'art-Latn-x-interslv-sloviant',
  LatinSouthern: 'art-Latn-x-interslv-southern',
  Polish: 'art-Latn-PL-x-interslv',
  GlagoliticSouthern: 'art-Glag-x-interslv-southern',
  GlagoliticSlovianto: 'art-Glag-x-interslv-sloviant',
  CyrillicEtymological: 'art-Cyrl-x-interslv-etym',
  CyrillicIotated: 'art-Cyrl-x-interslv-iotated',
  CyrillicIotatedExtended: 'art-Cyrl-x-interslv-iotated-ext',
  CyrillicNorthern: 'art-Cyrl-x-interslv-northern',
  CyrillicSlovianto: 'art-Cyrl-x-interslv-sloviant',
  CyrillicSouthern: 'art-Cyrl-x-interslv-southern',
} as const;

export type FlavorisationBCP47Code =
  (typeof FlavorisationBCP47)[keyof typeof FlavorisationBCP47];
