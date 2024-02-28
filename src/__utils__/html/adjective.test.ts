/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as adjective from './adjective';
import { declensionAdjective } from '../../adjective';

describe('renderers', () => {
  describe('HTML', () => {
    describe('noun declension', () => {
      test('render', () => {
        // This word does not exist, but it demonstrates the rendering
        // In alternative reality, it would mean "the best of all ever" :)
        const najdobry_koli = declensionAdjective(
          'najdobry',
          '-koli',
          'adj.sup.',
        )!;
        expect(adjective.render(najdobry_koli)).toMatchSnapshot();
      });

      test('renderDiff', () => {
        const before = declensionAdjective('svěži');
        // we choose a different noun to show the diff
        const after = declensionAdjective('črstvy');
        expect(adjective.renderDiff(before, after)).toMatchSnapshot();
      });
    });
  });
});
