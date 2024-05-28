import { forms } from '.';
import { formatAsUDPipe } from '../__utils__';

describe('ud/verb', () => {
  test('forms', () => {
    const result = forms('praviti', '', 'v.tr. ipf.');
    expect(formatAsUDPipe(result)).toMatchSnapshot();
  });
});
