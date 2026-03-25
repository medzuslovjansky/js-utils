export declare function conjugationVerbFlat(inf: string, rawPts: string, partOfSpeech?: string): string[];
/** @internal */
export declare function _getConjugationVerbFlat(result: SteenVerbParadigm | null): string[];
/** @deprecated */
export type SteenVerbParadigm = {
    infinitive: string;
    present: [string, string, string, string, string, string, string?];
    imperfect: [string, string, string, string, string, string];
    perfect: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string?
    ];
    pluperfect: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string?
    ];
    future: [string, string, string, string, string, string];
    conditional: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string?
    ];
    imperative: string;
    /**
     * Present active participle, derived from imperfective verbs.
     * @example 'dělajući'
     */
    prap?: string;
    /**
     * Present passive participle (uncommon)
     * @example 'dělajemy'
     */
    prpp?: string;
    /**
     * Past active participle, derived from perfective verbs.
     * @example 'sdělavši'
     */
    pfap?: string;
    /**
     * Past passive participle (bookish)
     * @example 'dělany'
     */
    pfpp?: string;
    gerund: string;
};
export declare function conjugationVerb(rawInf: string, rawPts: string, partOfSpeech?: string): SteenVerbParadigm | null;
