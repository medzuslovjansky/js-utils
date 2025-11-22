import { conjugationVerb } from '../../verb/conjugationVerb';
import { Token, IdentifiableString, XPOS, TokenFeatures } from '../schema';
import { parseXPos } from '../parseXPOS';
import { removeBrackets } from '../../utils';

export function adaptVerb(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
  irregular?: string,
): Token[] {
  const variants = parseXPos(xpos);
  const tokens: Token[] = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'VERB' && upos !== 'AUX') continue;

    // Pass partOfSpeech from xpos to conjugationVerb (it parses it internally)
    // Note: conjugationVerb expects the full xpos string (e.g. "v.tr. ipf.") as 3rd arg
    const paradigm = conjugationVerb(word, irregular || '', xpos);

    if (!paradigm) {
      tokens.push({
        token: word,
        upos,
        xpos,
        lemma,
        feats: baseFeats,
      });
      continue;
    }

    const addToken = (form: string | undefined, feats: TokenFeatures) => {
      if (!form) return;
      // Handle alternatives "form1, form2" or "form1 (form2)"
      // conjugationVerb often returns comma separated or with parens
      // normalize
      const parts = form
        .split(/,|;/)
        .map((s) => s.trim())
        .filter(Boolean);

      // Detect Variant=Short in comma-separated lists (e.g. "blěskajų, blěskam")
      if (
        parts.length === 2 &&
        !parts[0].includes('(') &&
        !parts[1].includes('(')
      ) {
        const [p1, p2] = parts;
        // Heuristic: if one is shorter, it's likely a contracted/short form
        if (p1.length !== p2.length) {
          const sorted = [p1, p2].sort((a, b) => b.length - a.length); // Longest first
          const long = sorted[0];
          const short = sorted[1];

          tokens.push({
            token: long,
            upos,
            xpos,
            lemma,
            feats: { ...baseFeats, ...feats, Variant: 'Long' },
          });

          tokens.push({
            token: short,
            upos,
            xpos,
            lemma,
            feats: { ...baseFeats, ...feats, Variant: 'Short' },
          });
          return;
        }
      }

      for (const part of parts) {
        // Handle parens: "znaje (zna)" -> znaje, zna
        const parenMatch = part.match(/^(.+)\s*\((.+)\)$/);
        if (parenMatch) {
          const main = parenMatch[1].trim();
          const alt = parenMatch[2].trim();

          tokens.push({
            token: main,
            upos,
            xpos,
            lemma,
            feats: { ...baseFeats, ...feats },
          });

          // If alternate is short form (often checking length is heuristic, or specific knowledge)
          // For verbs like 'znaje (zna)', 'zna' is short.
          // 'jest (je)' -> 'je' is short/clitic.
          const isShort = alt.length < main.length;
          tokens.push({
            token: alt,
            upos,
            xpos,
            lemma,
            feats: {
              ...baseFeats,
              ...feats,
              ...(isShort ? { Variant: 'Short' } : {}),
            },
          });
        } else {
          const clean = removeBrackets(part, '(', ')').trim(); // Removes (je) from (je) znal
          // removeBrackets might leave empty if "(je) znal" -> "znal"? No, it removes parens AND content.
          // Wait, removeBrackets implementation: "str.replace(new RegExp('\\' + open + '[^\\' + close + ']*\\' + close, 'g'), '')"
          // So "(je) znal" becomes " znal". Correct.
          // But for "znaje (zna)", we want both?
          // My `part` splitting above handles "znaje (zna)" if it was passed as one string.
          // But here I am using removeBrackets as fallback.

          // Actually, `conjugationVerb` outputs for perfect: "(je) znal".
          // We want to extract "znal". `removeBrackets` works for that.
          if (!clean) continue;
          tokens.push({
            token: clean,
            upos,
            xpos,
            lemma,
            feats: { ...baseFeats, ...feats },
          });
        }
      }
    };

    // Infinitive
    addToken(paradigm.infinitive, { VerbForm: 'Inf' });

    // Present Tense
    // paradigm.present is array [1sg, 2sg, 3sg, 1pl, 2pl, 3pl]
    if (paradigm.present) {
      const [p1s, p2s, p3s, p1p, p2p, p3p] = paradigm.present;
      addToken(p1s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '1',
      });
      addToken(p2s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '2',
      });
      addToken(p3s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '3',
      });
      addToken(p1p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '1',
      });
      addToken(p2p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '2',
      });
      addToken(p3p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '3',
      });
    }

    // Imperfect / Simple Past
    // paradigm.imperfect is array [1sg, 2sg, 3sg, 1pl, 2pl, 3pl]
    // Note: In IS, imperfect and aorist are often merged or this represents the simple past.
    // UD uses Tense=Past for this.
    if (paradigm.imperfect) {
      const [i1s, i2s, i3s, i1p, i2p, i3p] = paradigm.imperfect;
      addToken(i1s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '1',
      });
      addToken(i2s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '2',
      });
      addToken(i3s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '3',
      });
      addToken(i1p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '1',
      });
      addToken(i2p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '2',
      });
      addToken(i3p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '3',
      });
    }

    // Imperative
    // paradigm.imperative is a string "dělaj, dělajmo, dělajte"
    if (paradigm.imperative) {
      const parts = paradigm.imperative.split(',').map((s) => s.trim());
      // Usually: 2sg, 1pl, 2pl
      if (parts[0])
        addToken(parts[0], {
          VerbForm: 'Fin',
          Mood: 'Imp',
          Number: 'Sing',
          Person: '2',
        });
      if (parts[1])
        addToken(parts[1], {
          VerbForm: 'Fin',
          Mood: 'Imp',
          Number: 'Plur',
          Person: '1',
        });
      if (parts[2])
        addToken(parts[2], {
          VerbForm: 'Fin',
          Mood: 'Imp',
          Number: 'Plur',
          Person: '2',
        });
    }

    // L-participle (from perfect tense)
    // perfect: [1sg, ..., 3sg, ...]
    // 3sg is index 2: "(je) znal" or "(je) znala" or "(je) znalo"
    // We need to extract the forms.
    // Ideally we want: znal (Masc), znala (Fem), znalo (Neut), znali (Plur).
    // 1sg: "jesm znal(a)" -> "znal" or "znala"
    // 3sg: "(je) znal" -> "znal"
    // 3sg: "(je) znala" -> "znala"
    // 3sg: "(je) znalo" -> "znalo"
    // 3pl: "(sųt) znali" -> "znali"

    // Let's try to extract from specific indices
    if (paradigm.perfect) {
      const mascSg = extractLParticiple(paradigm.perfect[2]); // "(je) znal"
      const femSg = extractLParticiple(paradigm.perfect[3]); // "(je) znala"
      const neutSg = extractLParticiple(paradigm.perfect[4]); // "(je) znalo"
      const plur = extractLParticiple(paradigm.perfect[7]); // "(sųt) znali"

      if (mascSg)
        addToken(mascSg, {
          VerbForm: 'Part',
          Tense: 'Past',
          Number: 'Sing',
          Gender: 'Masc',
          Voice: 'Act',
        });
      if (femSg)
        addToken(femSg, {
          VerbForm: 'Part',
          Tense: 'Past',
          Number: 'Sing',
          Gender: 'Fem',
          Voice: 'Act',
        });
      if (neutSg)
        addToken(neutSg, {
          VerbForm: 'Part',
          Tense: 'Past',
          Number: 'Sing',
          Gender: 'Neut',
          Voice: 'Act',
        });
      if (plur)
        addToken(plur, {
          VerbForm: 'Part',
          Tense: 'Past',
          Number: 'Plur',
          Voice: 'Act',
        });
    }
  }

  return tokens;
}

function extractLParticiple(phrase: string | undefined): string | undefined {
  if (!phrase) return undefined;
  // remove aux verb in parens e.g. "(je) ", "(sųt) "
  // remove reflexive pronoun if present e.g. " sę"
  // also 1sg might be "jesm znal(a)" -> we want "znal" and "znala" but here we pick 3rd person forms which are cleaner
  return phrase
    .replace(/\([^)]+\)/g, '')
    .replace(/s[ęe]$/, '')
    .trim();
}
