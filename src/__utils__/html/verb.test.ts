/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as verb from './verb';
import { conjugationVerb } from '../../verb';

describe('renderers', () => {
  describe('HTML', () => {
    describe('verb conjugation', () => {
      test('render', () => {
        const example = conjugationVerb('dověděti sę', '(dově)')!;
        expect(verb.render(example)).toMatchSnapshot();
      });

      test('renderDiff', () => {
        const before = conjugationVerb('dověděti sę', '(dově)')!;
        // we choose a different verb to show the diff
        const after = conjugationVerb('pověděti', '(pově)')!;
        expect(verb.renderDiff(before, after)).toMatchSnapshot();
      });
    });
  });
});
