import Lemma from './Lemma';

type LemmaGroupOptions = {
  lemmas: Lemma[];
  delimiter?: string;
};

const hasCommas = (l: Lemma): boolean => l.hasCommas();

export default class LemmaGroup {
  constructor(options: Partial<LemmaGroupOptions> = {}) {
    this.lemmas = options.lemmas || [];
    this.delimiter = options.delimiter;
  }

  public lemmas: Lemma[];

  public delimiter?: string;

  public toString(): string {
    const delimiter =
      this.delimiter ?? (this.lemmas.some(hasCommas) ? '; ' : ', ');

    return this.lemmas.map(String).join(delimiter);
  }
}
