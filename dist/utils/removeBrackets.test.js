"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeBrackets_1 = require("./removeBrackets");
describe('removeBrackets', () => {
    test.each([
        ['euro [€]', '[', ']', 'euro'],
        ['adagio (muzyka)', '(', ')', 'adagio'],
    ])('(%j, %j, %j) === %j', (input, l, r, expected) => {
        expect((0, removeBrackets_1.removeBrackets)(input, l, r)).toBe(expected);
    });
});
//# sourceMappingURL=removeBrackets.test.js.map