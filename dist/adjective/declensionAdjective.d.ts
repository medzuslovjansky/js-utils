export declare function declensionAdjectiveFlat(adj: string, postfix: string, partOfSpeech?: string): string[];
/** @internal */
export declare function _getDeclensionAdjectiveFlat(result: any): string[];
/** @deprecated */
export type SteenAdjectiveParadigm = {
    singular: SteenAdjectiveParadigm$Case;
    plural: SteenAdjectiveParadigm$Case;
    short: string | undefined;
    comparison: SteenAdjectiveParadigm$Comparison;
};
type SteenAdjectiveParadigm$Case = {
    nom: string[];
    acc: string[];
    gen: string[];
    loc: string[];
    dat: string[];
    ins: string[];
};
type SteenAdjectiveParadigm$Comparison = {
    positive: string[];
    comparative: string[];
    superlative: string[];
};
export declare function declensionAdjective(adj: string, postfix?: string, partOfSpeech?: string): SteenAdjectiveParadigm;
export {};
