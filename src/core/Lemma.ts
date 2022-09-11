import { Annotation } from './Annotation';

type LemmaOptions = {
  value: string;
  annotations: Annotation[];
};

export default class Lemma {
  constructor(value: string | Partial<LemmaOptions> = {}) {
    if (typeof value !== 'string') {
      const options = value;

      this.value = options.value || '';
      this.annotations = options.annotations || [];
    } else {
      this.value = value;
      this.annotations = [];
    }
  }

  public value: string;

  public annotations: Annotation[];

  public hasCommas(): boolean {
    return this.value.includes(',');
  }

  public toString(): string {
    const n = this.annotations.length;

    if (n === 0) {
      return this.value;
    }

    return `${this.value} (${this.annotations.map(String).join('; ')})`;
  }
}
