/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { declensionPronounSimple } from '../../pronoun/declensionPronounSimple';
import * as fixtures from '../fixtures';
import * as pronoun from './pronoun';

describe('renderers', () => {
  describe('HTML', () => {
    describe('pronoun declension', () => {
      describe('adjective type', () => {
        test('render', () => {
          const to = declensionPronounSimple('to', 'pron.dem.')!;
          expect(pronoun.render(to)).toMatchSnapshot();
        });

        test('renderDiff', () => {
          const before = declensionPronounSimple('to', 'pron.dem.')!;
          const after = declensionPronounSimple('tamto', 'pron.dem.')!;
          expect(pronoun.renderDiff(before, after)).toMatchSnapshot();
        });
      });

      describe('noun type', () => {
        test('render', () => {
          const to = declensionPronounSimple('kto', 'pron.int.')!;
          expect(pronoun.render(to)).toMatchSnapshot();
        });

        test('renderDiff', () => {
          const before = declensionPronounSimple('kto', 'pron.int.')!;
          const after = declensionPronounSimple('čto', 'pron.int.')!;
          expect(pronoun.renderDiff(before, after)).toMatchSnapshot();
        });
      });

      test('should not throw an error given null', () => {
        expect(() => pronoun.render(null)).not.toThrow();
        expect(() => pronoun.renderDiff(null, null)).not.toThrow();
      });

      test('should throw an error when types do not match', () => {
        const before = declensionPronounSimple('to', 'pron.dem.')!;
        const after = declensionPronounSimple('kto', 'pron.int.')!;
        expect(() => pronoun.renderDiff(before, after)).toThrow();
      });

      test('should not throw exceptions', () => {
        const all = [
          ...fixtures.pronouns_demonstrative(),
          ...fixtures.pronouns_indefinite(),
          ...fixtures.pronouns_interrogative(),
          ...fixtures.pronouns_personal(),
          ...fixtures.pronouns_possessive(),
          ...fixtures.pronouns_reciprocal(),
          ...fixtures.pronouns_reflexive(),
          ...fixtures.pronouns_relative(),
        ];

        for (const [word, type] of all) {
          const declension = declensionPronounSimple(word, type);
          expect(() => pronoun.render(declension)).not.toThrow();
          expect(() => pronoun.renderDiff(null, declension)).not.toThrow();
        }
      });
    });
  });
});
