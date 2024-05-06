export const InterslavicBCP47 = {
  Generic: 'isv',
  Latin: 'isv-Latn',
  Cyrillic: 'isv-Cyrl',
  Glagolitic: 'isv-Glag',
  IPA: 'isv-x-fonipa',
} as const;

export type InterslavicBCP47Code =
  (typeof InterslavicBCP47)[keyof typeof InterslavicBCP47];

export const FlavorisationBCP47 = {
  ...InterslavicBCP47,
  ASCII: 'isv-Latn-x-ascii',
  LatinEtymological: 'isv-Latn-x-etymolog',
  LatinNorthern: 'isv-Latn-x-northern',
  LatinSlovianto: 'isv-Latn-x-sloviant',
  LatinSouthern: 'isv-Latn-x-southern',
  Polish: 'isv-Latn-PL',
  GlagoliticEtymological: 'isv-Glag-x-etymolog',
  GlagoliticNorthern: 'isv-Glag-x-northern',
  GlagoliticSlovianto: 'isv-Glag-x-sloviant',
  GlagoliticSouthern: 'isv-Glag-x-southern',
  CyrillicEtymological: 'isv-Cyrl-x-etymolog',
  CyrillicIotated: 'isv-Cyrl-x-iotated',
  CyrillicIotatedExtended: 'isv-Cyrl-x-iotated-ext',
  CyrillicNorthern: 'isv-Cyrl-x-northern',
  CyrillicSlovianto: 'isv-Cyrl-x-sloviant',
  CyrillicSouthern: 'isv-Cyrl-x-southern',
} as const;

export type FlavorisationBCP47Code =
  (typeof FlavorisationBCP47)[keyof typeof FlavorisationBCP47];
