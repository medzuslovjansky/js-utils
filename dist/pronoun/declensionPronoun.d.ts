/** @deprecated */
export interface SteenPronounParadigm {
    type: string;
    columns?: string[];
    cases?: Record<string, any>;
    casesSingular?: Record<string, any>;
    casesPlural?: Record<string, any>;
}
export declare function declensionPronounFlat(rawWord: string, pronounType: string): string[];
/** @internal */
export declare function _getDeclensionPronounFlat(result: SteenPronounParadigm): string[];
export declare function declensionPronoun(rawWord: string, pronounType: string): SteenPronounParadigm | null;
