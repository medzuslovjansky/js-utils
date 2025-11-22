/**
 * Derivation codes representing specific morphological processes.
 */
export type DerivationCode =
  // Noun suffixes
  | 'sfx:ok' // Diminutive masculine suffix -ok
  | 'sfx:ik' // Diminutive masculine suffix -ik
  | 'sfx:ek' // Diminutive masculine suffix -ek
  | 'sfx:ka' // Diminutive/Feminine suffix -ka
  | 'sfx:ko' // Diminutive/Neuter suffix -ko
  | 'sfx:stvo' // Abstract quality suffix -stvo
  | 'sfx:je' // Place suffix -je
  | 'sfx:išče' // Place indicator suffix -išče
  | 'sfx:nik' // Person/container suffix -nik
  | 'sfx:ec' // Inhabitant suffix -ec
  | 'sfx:an' // Inhabitant suffix -an
  | 'sfx:anin' // Inhabitant suffix -anin
  | 'sfx:nica' // Female equivalent suffix -nica
  | 'sfx:ica' // Female equivalent suffix -ica
  | 'sfx:e' // Baby animal suffix -e
  | 'sfx:ost' // Abstract quality from adjective suffix -ost
  | 'sfx:telj' // Person occupied with activity suffix -telj
  | 'sfx:ač' // Profession suffix -ač
  | 'sfx:ar' // Profession suffix -ar
  | 'sfx:tje' // Verbal noun suffix -tje

  // Adjective suffixes
  | 'sfx:sky' // Adjective suffix -sky (geographical/professional)
  | 'sfx:ji' // Adjective suffix -ji (animals/persons/divine)
  | 'sfx:ny' // Adjective suffix -ny (general)
  | 'sfx:ěny' // Material adjective suffix -ěny
  | 'sfx:ovy' // Characteristic adjective suffix -ovy
  | 'sfx:evy' // Characteristic adjective suffix -evy
  | 'sfx:ovity' // Similarity adjective suffix -ovity
  | 'sfx:evity' // Similarity adjective suffix -evity
  | 'sfx:livy' // Tendency/habit adjective suffix -livy
  | 'sfx:omy' // Possibility adjective suffix -omy
  | 'sfx:emy' // Possibility adjective suffix -emy
  | 'sfx:imy' // Possibility adjective suffix -imy
  | 'sfx:šnji' // Adverb to adjective suffix -šnji

  // Verb suffixes
  | 'sfx:ovati' // Noun to verb suffix -ovati
  | 'sfx:iti' // Verb suffix -iti
  | 'sfx:ěti' // Becoming verb suffix -ěti
  | 'sfx:yvati' // Imperfective verb suffix -yvati
  | 'sfx:jati' // Imperfective verb suffix -jati
  | 'sfx:ati' // Imperfective verb suffix -ati
  | 'sfx:vati' // Imperfective verb suffix -vati

  // Adverb suffixes
  | 'sfx:o' // Adverb suffix -o
  | 'sfx:je' // Comparative adverb suffix -je
  | 'sfx:ěje' // Comparative adverb suffix -ěje

  // Prefixes
  | 'pfx:do' // Prefix do- (to completion/additionally)
  | 'pfx:iz' // Prefix iz- (out/off/ex-)
  | 'pfx:na' // Prefix na- (up/on/over/perfective)
  | 'pfx:nad' // Prefix nad- (over/above)
  | 'pfx:nedo' // Prefix nedo- (incompletely)
  | 'pfx:o' // Prefix o- (give characteristics)
  | 'pfx:ob' // Prefix ob- (around/give characteristics)
  | 'pfx:obez' // Prefix obez- (devoid of)
  | 'pfx:od' // Prefix od- (away/off/complete action)
  | 'pfx:po' // Prefix po- (start/briefly/completion)
  | 'pfx:pod' // Prefix pod- (under/secretly)
  | 'pfx:prě' // Prefix prě- (across/transformation/through/too much)
  | 'pfx:prěd' // Prefix prěd- (before/in advance)
  | 'pfx:pri' // Prefix pri- (close/onto/addition/slightly)
  | 'pfx:pro' // Prefix pro- (through/miss/whole time/lose all)
  | 'pfx:raz' // Prefix raz- (apart/dis-/undo/middle of action)
  | 'pfx:s' // Prefix s- (together/down from/entirely)
  | 'pfx:so' // Prefix so- (together/down from/entirely)
  | 'pfx:su' // Prefix su- (next to/parallel/face to face)
  | 'pfx:u' // Prefix u- (away/totally/make more)
  | 'pfx:v' // Prefix v- (in/into/accurately)
  | 'pfx:vo' // Prefix vo- (in/into/accurately)
  | 'pfx:voz' // Prefix voz- (up/sudden intensive/back/again)
  | 'pfx:vy' // Prefix vy- (out/completely/well)
  | 'pfx:za' // Prefix za- (behind/closed/start doing)
  | 'pfx:bez' // Prefix bez- (without)
  | 'pfx:ne' // Negative prefix ne-
  | 'pfx:naj' // Superlative prefix naj-

  // Special derivation types
  | 'adj:cmp' // Comparative adjective
  | 'adj:sup' // Superlative adjective
  | 'adv:pos' // Adverb positive
  | 'adv:cmp' // Adverb comparative
  | 'adv:sup' // Adverb superlative
  | 'verb:prap' // Present Active Participle
  | 'verb:prpp' // Present Passive Participle
  | 'verb:pfap' // Past Active Participle
  | 'verb:pfpp' // Past Passive Participle
  | 'verb:vnoun'; // Verbal noun

/**
 * Represents a newly derived lemma.
 * Decoupled from CONLL-U Token structure.
 */
export interface DerivedLemma {
  /**
   * The lemma form of the derived word.
   */
  lemma: string;

  /**
   * The XPOS (part of speech tag) of the derived word.
   */
  xpos: string;

  /**
   * The derivation code explaining how this lemma was produced.
   */
  derivation: DerivationCode;

  /**
   * Optional extra features map (string to string) if needed for specific properties
   * that are not captured by XPOS alone (e.g. Polarity=Neg).
   */
  features?: Record<string, string>;
}
