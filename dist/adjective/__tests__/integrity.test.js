"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionAdjective_1 = require("../declensionAdjective");
test('declensionAdjectiveFlat integrity', () => {
    const positive = (0, declensionAdjective_1.declensionAdjectiveFlat)('dobry', '', 'adj.');
    const comparative = (0, declensionAdjective_1.declensionAdjectiveFlat)('lěpši', '', 'adj.comp.');
    const superlative = (0, declensionAdjective_1.declensionAdjectiveFlat)('najlěpši', '', 'adj.sup.');
    const joint = [...positive, ...comparative, ...superlative];
    // No empty strings expected
    expect(joint.filter(Boolean).length).toBe(joint.length);
    expect(positive.length).toBe(19);
    expect(comparative.length).toBe(14);
    expect(superlative.length).toBe(12);
});
//# sourceMappingURL=integrity.test.js.map