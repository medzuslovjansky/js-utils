export enum SlavicLanguage {
  Belarusian = 'be',
  Bosnian = 'bs',
  Bulgarian = 'bg',
  Croatian = 'hr',
  Czech = 'cs',
  Kashubian = 'csb',
  LowerSorbian = 'dsb',
  Macedonian = 'mk',
  Montenegrin = 'cnr',
  ChurchSlavonic = 'cu',
  OldRussian = 'orv',
  Polabian = 'pox',
  Polish = 'pl',
  Russian = 'ru',
  Rusyn = 'rue',
  Serbian = 'sr',
  Silesian = 'szl',
  Slovak = 'sk',
  Slovenian = 'sl',
  Ukrainian = 'uk',
  UpperSorbian = 'hsb',
}

export type SlavicRegionalTag =
  | 'z'
  | 'v'
  | 'j'
  | 'be'
  | 'bg'
  | 'bm'
  | 'cs'
  | 'csb'
  | 'cu'
  | 'cz'
  | 'dsb'
  | 'hr'
  | 'hsb'
  | 'iw'
  | 'mk'
  | 'ns'
  | 'ocs'
  | 'pl'
  | 'ps'
  | 're'
  | 'ru'
  | 'rue'
  | 'sb'
  | 'sh'
  | 'sk'
  | 'sl'
  | 'sr'
  | 'ub'
  | 'uk'
  | 'yu'
  | 'i'
  | 'ij'
  | 'in'
  | 'iz'
  | 'jc'
  | 'jn'
  | 'n'
  | 'sx';

export enum VoteStatus {
  Common = 1,
  Regional = 2,
  Individual = 3,
  Archaic = 4,
  Artificial = 5,
  Questionable = 9,
  Deprecated = 99,
}

export enum Genesis {
  Arabic = 'A',
  Deutsch = 'D',
  English = 'E',
  French = 'F',
  German = 'G',
  International = 'I',
  Artificial = 'M',
  Netherlands = 'N',
  Oriental = 'O',
  Slavic = 'S',
  Turkic = 'T',
}

export enum CrudeIntelligibilityLevel {
  Full = 1,
  Incomplete = 0.5,
  Disputed = 0.5,
  Other1 = 0.5,
  Unknown = 0.1,
}

export type CrudeIntelligibilityReport = Partial<
  Record<SlavicLanguage, CrudeIntelligibilityLevel>
>;
