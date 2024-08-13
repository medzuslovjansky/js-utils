import { scientific } from '../__utils__/fixtures';
import { descientify } from './descientify';

describe('descientify', () => {
  test.each([...scientific().map((s) => [s])])('%s', (text) => {
    const result = descientify(text);
    if (text.match(/[’ḓṙėıŀřèòù]/i) || text.match(/jě/i)) {
      expect(result).not.toEqual(text);
      expect(result).toMatchSnapshot();
    } else {
      expect(result).toEqual(text);
    }
  });

  test('compatibility mode', () => {
    expect(descientify('mle̊ko', true)).toEqual('mlěko');
    expect(descientify('pėnj', true)).toEqual('pėnj');
  });
});
