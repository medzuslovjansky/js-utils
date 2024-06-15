import { declensionAdjectiveFlat } from '../declensionAdjective';

test('declensionAdjectiveFlat integrity', () => {
  const positive = declensionAdjectiveFlat('dobry', '', 'adj.');
  const comparative = declensionAdjectiveFlat('lěpši', '', 'adj.comp.');
  const superlative = declensionAdjectiveFlat('najlěpši', '', 'adj.sup.');
  const joint = [...positive, ...comparative, ...superlative];

  // No empty strings expected
  expect(joint.filter(Boolean).length).toBe(joint.length);
  expect(positive.length).toBe(19);
  expect(comparative.length).toBe(14);
  expect(superlative.length).toBe(12);
});
