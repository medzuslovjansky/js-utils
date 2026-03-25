export interface Latn2GlagOptions {
    /** @default false */
    latinateMyslite?: boolean;
    /** @default true */
    shta?: boolean;
}
export declare function latn2glag(text: string, options?: Required<Latn2GlagOptions>): string;
