import { Lemma } from './Lemma';

export type LemmaGroupOptions = {
  lemmas: Lemma[];
  delimiter?: string;
};

const hasCommas = (l: Lemma): boolean => l.hasCommas();

export class LemmaGroup {
  constructor(lemmas: Lemma[] | Partial<LemmaGroupOptions> = {}) {
    if (Array.isArray(lemmas)) {
      this.lemmas = lemmas;
      this.delimiter = undefined;
    } else {
      const options = lemmas;
      this.lemmas = options.lemmas || [];
      this.delimiter = options.delimiter;
    }
  }

  public lemmas: Lemma[];

  public delimiter?: string;

  public toString(): string {
    const delimiter =
      this.delimiter ?? (this.lemmas.some(hasCommas) ? '; ' : ', ');

    return this.lemmas.map(String).join(delimiter);
  }
}
