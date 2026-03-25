/** @deprecated */
export interface SteenNumeralParadigm {
    type: string;
    columns?: string[];
    cases?: Record<string, any>;
    casesSingular?: Record<string, any>;
    casesPlural?: Record<string, any>;
}
export declare function declensionNumeralFlat(rawWord: string, numeralType: string): string[];
/** @internal */
export declare function _getDeclensionNumeralFlat(result: SteenNumeralParadigm): string[];
export declare function declensionNumeral(rawWord: string, numeralType: string): SteenNumeralParadigm | null;
