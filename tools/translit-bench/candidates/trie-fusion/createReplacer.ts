/**
 * A flat longest-match substitution table, compiled once into a trie keyed
 * on UTF-16 code units -- the same unit `.length`/`.slice` already used
 * throughout this codebase, so multi-codepoint keys (combining marks, tie
 * bars in `latn2ipa`) behave exactly as they did in the original substring
 * scan: neither implementation is grapheme-aware, and this one has to match
 * the original bug-for-bug, not fix it.
 *
 * The original tried every key length from longest down to 1 at each input
 * position, slicing (and allocating) a fresh candidate substring per
 * attempt. A trie visits each input character once: walk down while an edge
 * exists, remember the deepest node reached that terminates a key, and take
 * that match -- or fall back to copying one character -- when the walk runs
 * out of edges. No empty-string key is ever inserted or matched: the
 * original's `l > 0` guard means a `''` key was always dead code, and this
 * keeps that.
 */
type TrieNode = {
  children: Record<string, TrieNode> | null;
  value: string | undefined;
  isEnd: boolean;
};

function makeNode(): TrieNode {
  return { children: null, value: undefined, isEnd: false };
}

export function createReplacer(map: Record<string, string>) {
  const root = makeNode();

  for (const key of Object.keys(map)) {
    if (key.length === 0) continue; // original never matched '' (see above)
    const replacement = mirrorTerminators(key, map[key]);
    let node = root;
    for (let i = 0; i < key.length; i++) {
      const ch = key[i];
      node.children ??= Object.create(null);
      let next = node.children![ch];
      if (!next) {
        next = makeNode();
        node.children![ch] = next;
      }
      node = next;
    }
    node.value = replacement;
    node.isEnd = true;
  }

  return function remapWord(str: string): string {
    const len = str.length;
    let result = '';
    let i = 0;
    while (i < len) {
      let node = root;
      let matchEnd = -1;
      let matchValue = '';
      let j = i;
      while (node.children !== null && j < len) {
        const next = node.children[str[j]];
        if (next === undefined) break;
        node = next;
        j++;
        if (node.isEnd) {
          matchEnd = j;
          matchValue = node.value!;
        }
      }
      if (matchEnd !== -1) {
        result += matchValue;
        i = matchEnd;
      } else {
        result += str[i];
        i++;
      }
    }
    return result;
  };
}

function mirrorTerminators(pattern: string, replacement: string) {
  const start = pattern[0] === '|' ? '|' : '';
  const end = pattern[pattern.length - 1] === '|' ? '|' : '';
  return `${start}${replacement}${end}`;
}
