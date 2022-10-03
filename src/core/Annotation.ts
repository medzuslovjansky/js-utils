export type AnnotationType = 'archaic' | 'colloquial' | 'custom';

export type AnnotationOptions = {
  value: string;
  type: AnnotationType;
};

export class Annotation {
  constructor(options: Partial<AnnotationOptions> = {}) {
    this.value = options.value || '';
    this.type = options.type || 'custom';
  }

  public value: string;

  public type: AnnotationType;

  public clone(): Annotation {
    return new Annotation({
      value: this.value,
      type: this.type,
    });
  }

  public toString(): string {
    return this.value;
  }

  static fromString(value: string): Annotation {
    return new Annotation({ value });
  }
}
