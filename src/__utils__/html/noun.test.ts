/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as noun from './noun';
import { declensionNounSimple } from '../../noun';

describe('renderers', () => {
  describe('HTML', () => {
    describe('noun declension', () => {
      test('render', () => {
        const taksi = declensionNounSimple('vrěsėnj', 'm.sg.')!;
        expect(noun.render(taksi)).toMatchSnapshot();
      });

      test('renderDiff', () => {
        const before = declensionNounSimple('hlåpėc', 'm.anim.')!;
        // we choose a different noun to show the diff
        const after = declensionNounSimple('děvčina', 'f.')!;
        expect(noun.renderDiff(before, after)).toMatchSnapshot();
      });
    });
  });
});
