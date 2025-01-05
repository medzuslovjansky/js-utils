export interface Encoding {
  encode(input: string): Uint8Array;
  decode(input: Uint8Array): string;
}
