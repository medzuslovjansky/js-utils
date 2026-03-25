import type { Noun } from '../partOfSpeech';
export declare function declensionNounFlat(rawNoun: string, rawAdd: string, originGender: Noun['gender'], animated: boolean, isPlural: boolean, isSingular: boolean, isIndeclinable: boolean): string[];
/** @internal */
export declare function _getDeclensionNounFlat(result: any): string[];
/** @deprecated */
export type SteenNounParadigm = {
    nom: [string | null, string | null];
    acc: [string | null, string | null];
    gen: [string | null, string | null];
    loc: [string | null, string | null];
    dat: [string | null, string | null];
    ins: [string | null, string | null];
    voc: [string | null, string | null];
};
export declare function declensionNoun(rawNoun: string, rawAdd: string, originGender: Noun['gender'], animated: boolean, isPlural: boolean, isSingular: boolean, isIndeclinable: boolean): SteenNounParadigm | null;
