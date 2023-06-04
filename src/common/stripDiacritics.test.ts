import { stripDiacritics } from './stripDiacritics';

describe('stripDiacritics', () => {
  test('råbotati -> rabotati', () => {
    expect(stripDiacritics('råbotati')).toBe('rabotati');
  });

  test('sųråbotati -> surabotati', () => {
    expect(stripDiacritics('sųråbotati')).toBe('surabotati');
  });

  test('gòltnųti -> goltnuti', () => {
    expect(stripDiacritics('gòltnųti')).toBe('goltnuti');
  });

  test('Organizacija Sjedinjenyh Narodov -> ...', () => {
    expect(stripDiacritics('Organizacija Sjedinjenyh Narodov')).toBe(
      'Organizacija Sjedinjenyh Narodov',
    );
  });
});
