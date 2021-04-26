export type AnnotationType = 'archaic' | 'colloquial' | 'custom';

type AnnotationOptions = {
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

  public toString(): string {
    return this.value;
  }

  static fromString(value: string): Annotation {
    return new Annotation({ value });
  }
}
