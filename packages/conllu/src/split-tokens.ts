import type { Token } from './schema.ts';
import type { Misc } from './misc.ts';

type TokenClass = 'word' | 'punct' | 'space' | 'number' | 'dash';

function classifyChar(char: string): TokenClass {
  if (/\s/.test(char)) return 'space';
  if (char === '-') return 'dash'; // Special case for affixes
  if (/\p{P}/u.test(char)) return 'punct';
  if (/\d/.test(char)) return 'number';
  return 'word';
}

interface RawToken {
  form: string;
  class: TokenClass;
  hasSpaceAfter: boolean;
}

function tokenize(str: string): RawToken[] {
  const rawTokens: RawToken[] = [];
  let current = '';
  let currentClass: TokenClass | null = null;

  const flush = () => {
    if (current && currentClass && currentClass !== 'space') {
      rawTokens.push({
        form: current,
        class: currentClass,
        hasSpaceAfter: true, // Will be fixed in post-processing
      });
    }
    current = '';
    currentClass = null;
  };

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const charClass = classifyChar(char);

    if (charClass === 'space') {
      flush();
      continue;
    }

    if (charClass === 'dash') {
      // Dash handling: attach to adjacent word
      const prevClass = currentClass;
      const nextChar = str[i + 1];
      const nextClass = nextChar ? classifyChar(nextChar) : null;

      if (prevClass === 'word') {
        // "word-word" keeps accumulating as one word; bare "word-" is a prefix
        current += char;
        if (nextClass !== 'word') flush();
      } else if (nextClass === 'word') {
        // "-word" (suffix) - start new token with dash
        flush();
        current = char;
        currentClass = 'word';
      } else {
        // Standalone dash - treat as punct
        flush();
        current = char;
        currentClass = 'punct';
        flush();
      }
      continue;
    }

    if (
      currentClass === charClass ||
      (currentClass === 'word' && current.endsWith('-'))
    ) {
      current += char;
    } else {
      flush();
      current = char;
      currentClass = charClass;
    }
  }
  flush();

  // SpaceAfter=No is recovered from gaps in the original string, not tracked
  // while scanning.
  let pos = 0;
  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    const tokenStart = str.indexOf(token.form, pos);
    const tokenEnd = tokenStart + token.form.length;
    pos = tokenEnd;

    const nextToken = rawTokens[i + 1];
    if (nextToken) {
      const nextStart = str.indexOf(nextToken.form, pos);
      token.hasSpaceAfter = nextStart > tokenEnd;
    } else {
      token.hasSpaceAfter = true; // Last token
    }
  }

  return rawTokens;
}

/**
 * Split a string into tokens (words and punctuation).
 * Words are left unresolved (no upos, no lemma) - resolution happens later.
 * Only punctuation and numbers are identified here.
 * Sets SpaceAfter=No when there's no space between tokens.
 * Handles affixes: "word-" (prefix) and "-word" (suffix) kept as single tokens.
 */
export function splitTokens(str: string): Token[] {
  const rawTokens = tokenize(str);

  return rawTokens.map((raw, index) => {
    const id = index + 1;
    const misc: Misc | undefined = raw.hasSpaceAfter
      ? undefined
      : { SpaceAfter: 'No' };

    if (raw.class === 'punct') {
      return {
        id,
        form: raw.form,
        lemma: raw.form,
        upos: 'PUNCT' as const,
        ...(misc && { misc }),
      };
    }

    if (raw.class === 'number') {
      return {
        id,
        form: raw.form,
        lemma: raw.form,
        upos: 'NUM' as const,
        ...(misc && { misc }),
      };
    }

    // Words start unresolved (no upos, no lemma) - resolution happens later
    return {
      id,
      form: raw.form,
      ...(misc && { misc }),
    };
  });
}

export function joinTokens(tokens: Token[]): string {
  return tokens
    .map((token, index) => {
      const isLast = index === tokens.length - 1;
      const hasSpaceAfter = token.misc?.SpaceAfter !== 'No';
      return token.form + (isLast ? '' : hasSpaceAfter ? ' ' : '');
    })
    .join('');
}
