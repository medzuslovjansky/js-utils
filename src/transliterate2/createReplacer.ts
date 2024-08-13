export function createReplacer(map: Record<string, string>) {
  let maxLength = 1;
  for (const key of Object.keys(map)) {
    map[key] = mirrorTerminators(key, map[key]);
    maxLength = Math.max(maxLength, key.length);
  }

  function remapWord(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      for (let l = maxLength; l >= 0; l--) {
        if (l > 0) {
          const chunk = str.slice(i, i + l);
          const transliteratedChunk = map[chunk];
          if (transliteratedChunk !== void 0) {
            result += transliteratedChunk;
            i += l - 1;
            break;
          }
        } else {
          result += str[i];
        }
      }
    }

    return result;
  }

  return remapWord;
}

function mirrorTerminators(pattern: string, replacement: string) {
  const start = pattern[0] === '|' ? '|' : '';
  const end = pattern[pattern.length - 1] === '|' ? '|' : '';
  return `${start}${replacement}${end}`;
}
