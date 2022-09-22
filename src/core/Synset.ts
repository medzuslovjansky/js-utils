import LemmaGroup from './LemmaGroup';
import Lemma from './Lemma';
import { Annotation } from './Annotation';

type SynsetOptions = {
  autogenerated: boolean;
  debatable: boolean;
  groups: LemmaGroup[];
};

export type SynsetMetadata = {
  autogenerated: boolean;
  debatable: boolean;
};

export class Synset {
  constructor(options: Partial<SynsetOptions> = {}) {
    this.meta = {
      autogenerated: options.autogenerated ?? true,
      debatable: options.debatable ?? false,
    };

    this.groups = options.groups || [];
  }

  public meta: SynsetMetadata;
  public groups: LemmaGroup[];

  public add(
    value: LemmaGroup | LemmaGroup[] | Lemma | Lemma[] | string | string[],
  ): this {
    if (Array.isArray(value)) {
      for (const val of value) {
        this.add(val);
      }

      return this;
    }

    let group!: LemmaGroup;
    let lemma!: Lemma;

    if (typeof value === 'string') {
      lemma = new Lemma({ value });
    } else if (value instanceof Lemma) {
      lemma = value;
    } else if (value instanceof LemmaGroup) {
      group = value;
    }

    if (lemma && !group) {
      if (this.groups.length === 0) {
        group = new LemmaGroup({ lemmas: [lemma] });
        this.groups.push(group);
      } else {
        group = this.groups[this.groups.length - 1];
        group.lemmas.push(lemma);
      }
    } else if (group) {
      this.groups.push(group);
    } else {
      throw new TypeError('Cannot add non-Lemma/LemmaGroup/string to a synset');
    }

    return this;
  }

  public intersection(other: Synset): Synset {
    const result = new Synset({
      autogenerated: this.meta.autogenerated || other.meta.autogenerated,
      debatable: this.meta.debatable || other.meta.debatable,
    });

    for (const l1 of this.lemmas()) {
      for (const l2 of other.lemmas()) {
        if (l1.value === l2.value) {
          result.add(l1.value);
        }
      }
    }

    return result;
  }

  public get empty(): boolean {
    return !!this.lemmas().next().done;
  }

  public *lemmas(): IterableIterator<Lemma> {
    for (const group of this.groups) {
      yield* group.lemmas;
    }
  }

  public *annotations(): IterableIterator<Annotation> {
    for (const lemma of this.lemmas()) {
      yield* lemma.annotations;
    }
  }

  public toString(): string {
    return (
      (this.meta.debatable ? '#' : '') +
      (this.meta.autogenerated ? '!' : '') +
      this.groups.map(String).join('; ')
    );
  }
}
