export declare enum TransliterationType {
    Latin = 1,
    ASCII = 2,
    Polish = 3,
    StandardCyrillic = 5,
    TraditionalIotatedCyrillic = 6,
    Glagolitic = 7,
    IPA = 10
}
export declare enum FlavorizationType {
    CyrillicExtended = 1,
    Etymological = 2,
    Standard = 3,
    Slovianto = 4,
    Southern = "J",
    Northern = "S"
}
/**
 * @param iSource
 * @param type
 * @param flav
 * @param preprocessed whether the input is already preprocessed, and should not be normalized
 * @see {@link http://steen.free.fr/scripts/transliteration.js}
 */
export declare function transliterate(iSource: string, type: number, flav?: string | number, preprocessed?: boolean): string;
