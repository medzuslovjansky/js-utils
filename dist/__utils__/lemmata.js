"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPosTags = exports.findLemmaById = void 0;
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const partOfSpeech_1 = require("../partOfSpeech");
const fixturesDir = node_path_1.default.join(__dirname, '../../src/__fixtures__');
let fixtures;
function findLemmaById(id) {
    return initFixtures().get(id)?.[2] ?? id;
}
exports.findLemmaById = findLemmaById;
function findPosTags(id) {
    const pos = initFixtures().get(id)?.[1];
    if (!pos)
        return [];
    const { name, ...attributes } = (0, partOfSpeech_1.parsePos)(pos);
    const trueAttributes = Object.entries(attributes)
        .filter(([_, value]) => value)
        .map(([key]) => key);
    return [name, ...trueAttributes];
}
exports.findPosTags = findPosTags;
function initFixtures() {
    if (!fixtures) {
        const map = (fixtures = new Map());
        node_fs_1.default.readdirSync(fixturesDir).forEach((name) => {
            const jsonPath = node_path_1.default.join(fixturesDir, name);
            const json = node_fs_1.default.readFileSync(jsonPath, 'utf-8');
            const data = JSON.parse(json);
            for (const row of data) {
                map.set(row[0], row);
            }
        });
    }
    return fixtures;
}
//# sourceMappingURL=lemmata.js.map