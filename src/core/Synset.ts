import isIterable from '../utils/isIterable';

import { LemmaGroup } from './LemmaGroup';
import { Lemma } from './Lemma';
import { Annotation } from './Annotation';

export type SynsetOptions = {
  autogenerated: boolean;
  debatable: boolean;
  groups: LemmaGroup[];
};

type EqualityPredicate<T> = (a: T, b: T) => boolean;

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

  public clone(): Synset {
    return new Synset({
      autogenerated: this.meta.autogenerated,
      debatable: this.meta.debatable,
      groups: this.groups.map((g) => g.clone()),
    });
  }

  public add(
    value:
      | LemmaGroup
      | Lemma
      | string
      | Iterable<LemmaGroup>
      | Iterable<Lemma>
      | Iterable<string>,
  ): this {
    if (isIterable(value) && typeof value !== 'string') {
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
      lemma = value.clone();
    } else if (value instanceof LemmaGroup) {
      group = value.clone();
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

  public intersection(
    other: Synset,
    equals: EqualityPredicate<Lemma> = valueEquals,
  ): Synset {
    const result = new Synset({
      autogenerated: this.meta.autogenerated || other.meta.autogenerated,
      debatable: this.meta.debatable || other.meta.debatable,
    });

    for (const l1 of this.lemmas()) {
      for (const l2 of other.lemmas()) {
        if (equals(l1, l2)) {
          result.add(l1.clone());
        }
      }
    }

    return result;
  }

  public get empty(): boolean {
    return !!this.lemmas().next().done;
  }

  public union(
    other: Synset,
    equals: EqualityPredicate<Lemma> = valueEquals,
  ): Synset {
    const result = new Synset({
      autogenerated: this.meta.autogenerated || other.meta.autogenerated,
      debatable: this.meta.debatable || other.meta.debatable,
    }).add(this.lemmas());

    for (const l2 of other.lemmas()) {
      let exists = false;
      for (const l1 of this.lemmas()) {
        if (equals(l1, l2)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        result.add(l2.value);
      }
    }

    return result;
  }

  public difference(
    other: Synset,
    equals: EqualityPredicate<Lemma> = valueEquals,
  ): Synset {
    const result = new Synset({
      autogenerated: this.meta.autogenerated || other.meta.autogenerated,
      debatable: this.meta.debatable || other.meta.debatable,
    });

    for (const l1 of this.lemmas()) {
      let exists = false;
      for (const l2 of other.lemmas()) {
        if (equals(l1, l2)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        result.add(l1.clone());
      }
    }

    return result;
  }

  public clear(): this {
    this.groups.splice(0, Infinity);
    return this;
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

function valueEquals(a: Lemma, b: Lemma): boolean {
  return a.value === b.value;
}
