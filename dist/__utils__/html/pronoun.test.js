"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const declensionPronounSimple_1 = require("../../pronoun/declensionPronounSimple");
const fixtures = tslib_1.__importStar(require("../fixtures"));
const pronoun = tslib_1.__importStar(require("./pronoun"));
describe('renderers', () => {
    describe('HTML', () => {
        describe('pronoun declension', () => {
            describe('adjective type', () => {
                test('render', () => {
                    const to = (0, declensionPronounSimple_1.declensionPronounSimple)('to', 'pron.dem.');
                    expect(pronoun.render(to)).toMatchSnapshot();
                });
                test('renderDiff', () => {
                    const before = (0, declensionPronounSimple_1.declensionPronounSimple)('to', 'pron.dem.');
                    const after = (0, declensionPronounSimple_1.declensionPronounSimple)('tamto', 'pron.dem.');
                    expect(pronoun.renderDiff(before, after)).toMatchSnapshot();
                });
            });
            describe('noun type', () => {
                test('render', () => {
                    const to = (0, declensionPronounSimple_1.declensionPronounSimple)('kto', 'pron.int.');
                    expect(pronoun.render(to)).toMatchSnapshot();
                });
                test('renderDiff', () => {
                    const before = (0, declensionPronounSimple_1.declensionPronounSimple)('kto', 'pron.int.');
                    const after = (0, declensionPronounSimple_1.declensionPronounSimple)('čto', 'pron.int.');
                    expect(pronoun.renderDiff(before, after)).toMatchSnapshot();
                });
            });
            test('should not throw an error given null', () => {
                expect(() => pronoun.render(null)).not.toThrow();
                expect(() => pronoun.renderDiff(null, null)).not.toThrow();
            });
            test('should throw an error when types do not match', () => {
                const before = (0, declensionPronounSimple_1.declensionPronounSimple)('to', 'pron.dem.');
                const after = (0, declensionPronounSimple_1.declensionPronounSimple)('kto', 'pron.int.');
                expect(() => pronoun.renderDiff(before, after)).toThrow();
            });
            test('should not throw exceptions', () => {
                const all = [
                    ...fixtures.pronouns_demonstrative(),
                    ...fixtures.pronouns_indefinite(),
                    ...fixtures.pronouns_interrogative(),
                    ...fixtures.pronouns_personal(),
                    ...fixtures.pronouns_possessive(),
                    ...fixtures.pronouns_reciprocal(),
                    ...fixtures.pronouns_reflexive(),
                    ...fixtures.pronouns_relative(),
                ];
                for (const [word, type] of all) {
                    const declension = (0, declensionPronounSimple_1.declensionPronounSimple)(word, type);
                    expect(() => pronoun.render(declension)).not.toThrow();
                    expect(() => pronoun.renderDiff(null, declension)).not.toThrow();
                }
            });
        });
    });
});
//# sourceMappingURL=pronoun.test.js.map