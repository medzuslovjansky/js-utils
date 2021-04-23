import Lemma from './Lemma';

type LemmaGroupOptions = {
  lemmas: Lemma[];
};

const hasCommas = (l: Lemma): boolean => l.hasCommas();

export default class LemmaGroup {
  constructor(options: Partial<LemmaGroupOptions> = {}) {
    this.lemmas = options.lemmas || [];
  }

  public lemmas: Lemma[];

  public toString(): string {
    const delimiter = this.lemmas.some(hasCommas) ? '; ' : ', ';
    return this.lemmas.map(String).join(delimiter);
  }
}
