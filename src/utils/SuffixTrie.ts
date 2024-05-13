interface TrieNode {
  [key: string]: TrieNode | 0 | undefined;
}

export const enum TrieMatch {
  ENDS = 2,
  WHOLE = 1,
  MISMATCH = 0,
}

function isTerminal(node: TrieNode): boolean {
  return node === TERMINAL || node[''] === 0;
}

const TERMINAL: TrieNode = { '': 0 };
const NIL: TrieNode = {};

export class SuffixTrie {
  // eslint-disable-next-line ecmascript-compat/compat
  private readonly node: TrieNode;

  constructor(dict?: TrieNode);
  constructor(tokens?: string[]);
  constructor(arg?: any) {
    if (Array.isArray(arg)) {
      this.node = {};
      for (const token of arg) {
        this.add(token);
      }
    } else {
      this.node = arg || {};
    }
  }

  add(token: string): this {
    let current: any = this.node;

    // iterate over every letter in the token/word.
    for (let index = token.length - 1; index >= 0; index--) {
      const letter = token[index];
      const next = current[letter];

      if (next == null) {
        // for the last letter of the word, assign 0. For others, assign empty object.
        current = current[letter] = index === 0 ? 0 : {};
      } else if (next === 0) {
        current = current[letter] = { '': 0 };
      } else {
        current = current[letter];
        if (index === 0) {
          current[''] = 0;
        }
      }
    }

    return this;
  }

  toJSON(): TrieNode {
    return this.node;
  }

  match(word: string): TrieMatch {
    const index = this.findIndex(word);
    if (index === -1) {
      return TrieMatch.MISMATCH;
    }

    return index === 0 ? TrieMatch.WHOLE : TrieMatch.ENDS;
  }

  findIndex(word: string): number {
    const length = word.length;

    let node: TrieNode | undefined = this.node;
    let next: TrieNode[''];
    let chr = '';
    let i: number;
    let index = -1;

    for (i = length - 1; node && i >= 0; i--) {
      chr = word[i];
      next = node[chr];
      node = next === 0 ? TERMINAL : next ?? NIL;
      if (isTerminal(node)) {
        index = i;
      }
    }

    return index;
  }

  [Symbol.iterator](): Iterator<string> {
    const stack: [TrieNode, string][] = [[this.node, '']];
    const results: string[] = [];

    return {
      next(): IteratorResult<string> {
        if (results.length) {
          return { value: results.pop()!, done: false };
        }

        while (stack.length) {
          const [node, suffix] = stack.pop()!;
          for (const key in node) {
            if (key === '') {
              results.push(suffix);
            } else if (node[key] === 0) {
              results.push(key + suffix);
            } else {
              stack.push([node[key] as TrieNode, key + suffix]);
            }
          }
        }

        if (results.length) {
          return { value: results.pop()!, done: false };
        }

        return { value: '', done: true };
      },
    };
  }

  get size(): number {
    const iterator = this[Symbol.iterator]();
    let count = 0;
    while (!iterator.next().done) {
      count++;
    }
    return count;
  }
}
