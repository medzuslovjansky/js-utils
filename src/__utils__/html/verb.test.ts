/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as verb from './verb';
import { conjugationVerb } from '../../verb';

describe('renderers', () => {
  describe('HTML', () => {
    describe('verb conjugation', () => {
      test('render', () => {
        const dreti = conjugationVerb('drěti', '(dere)')!;
        expect(verb.render(dreti)).toMatchSnapshot();
      });

      test('renderDiff', () => {
        const before = conjugationVerb('dreti', '(dere)')!;
        // we choose a different verb to show the diff
        const after = conjugationVerb('trěti', '(tre)')!;
        expect(verb.renderDiff(before, after)).toMatchSnapshot();
      });
    });
  });
});
