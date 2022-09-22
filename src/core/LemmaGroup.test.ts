import { LemmaGroup } from './LemmaGroup';
import { Lemma } from './Lemma';

describe('LemmaGroup', () => {
  let group: LemmaGroup;

  describe('when created', () => {
    describe('with no args', () => {
      beforeEach(() => {
        group = new LemmaGroup();
      });

      it('should have an undefined delimiter', () => {
        expect(group.delimiter).toBe(undefined);
      });

      it('should have no lemmas', () => {
        expect(group.lemmas).toEqual([]);
      });
    });

    describe('with delimiter and lemmas', () => {
      beforeEach(() => {
        group = new LemmaGroup({
          lemmas: [new Lemma({ value: 'this' })],
          delimiter: ';',
        });
      });

      it('should have that delimiter', () => {
        expect(group.delimiter).toBe(';');
      });

      it('should have those lemmas', () => {
        expect(group.lemmas.map((l) => l.value)).toEqual(['this']);
      });
    });
  });

  describe('when stringified', () => {
    it('should use the delimiter for the lemmas if it is defined', () => {
      group = new LemmaGroup({
        lemmas: [new Lemma({ value: 'and' }), new Lemma({ value: 'but' })],
        delimiter: '; ',
      });

      expect(`${group}`).toBe('and; but');
    });

    it('should deduce , (comma) if no lemma has a comma inside', () => {
      group = new LemmaGroup({
        lemmas: [new Lemma({ value: 'and' }), new Lemma({ value: 'but' })],
      });

      expect(`${group}`).toBe('and, but');
    });

    it('should deduce ; (semi-colon) if some lemma has a comma inside', () => {
      group = new LemmaGroup({
        lemmas: [new Lemma({ value: 'and, why' }), new Lemma({ value: 'but' })],
      });

      expect(`${group}`).toBe('and, why; but');
    });
  });
});
