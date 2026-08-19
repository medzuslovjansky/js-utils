import { transliterate, getFlavorisationName } from '@interslavic/translit';
import { inflect, derive, detectPos } from '@interslavic/morphology';
import { formatTokens } from '@interslavic/conllu';
import { distance } from '@interslavic/levenshtein';
import { registerLunr } from '@interslavic/stemmer/lunr';
import { stem } from '@interslavic/stemmer';
import lunr from 'lunr';

// Initialize Lunr plugin
registerLunr(lunr);

// Setup Tab Switching
const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
const tabPanels = document.querySelectorAll<HTMLElement>('.tab-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    tabButtons.forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    tabPanels.forEach((p) => {
      p.classList.toggle('active', p.id === `panel-${tabName}`);
    });
  });
});

// ==========================================
// 1. TRANSLITERATION WIDGET
// ==========================================
const translitInput = document.getElementById(
  'translit-input',
) as HTMLTextAreaElement;
const translitTarget = document.getElementById(
  'translit-target',
) as HTMLSelectElement;
const translitOutput = document.getElementById(
  'translit-output',
) as HTMLElement;
const copyTranslitBtn = document.getElementById(
  'copy-translit',
) as HTMLButtonElement;

// Populate transliteration target select box
const BCP47_OPTIONS = [
  { code: 'isv-Latn', label: 'Standard Latin (isv-Latn)' },
  { code: 'isv-Cyrl', label: 'Standard Cyrillic (isv-Cyrl)' },
  { code: 'isv-Glag', label: 'Glagolitic (isv-Glag)' },
  { code: 'isv-x-fonipa', label: 'IPA Phonetic (isv-x-fonipa)' },
  {
    code: 'isv-Latn-x-etymolog',
    label: 'Etymological Latin (isv-Latn-x-etymolog)',
  },
  {
    code: 'isv-Cyrl-x-etymolog',
    label: 'Etymological Cyrillic (isv-Cyrl-x-etymolog)',
  },
  {
    code: 'isv-Glag-x-etymolog',
    label: 'Etymological Glagolitic (isv-Glag-x-etymolog)',
  },
  {
    code: 'isv-Latn-x-northern',
    label: 'Northern Latin (isv-Latn-x-northern)',
  },
  {
    code: 'isv-Cyrl-x-northern',
    label: 'Northern Cyrillic (isv-Cyrl-x-northern)',
  },
  {
    code: 'isv-Latn-x-southern',
    label: 'Southern Latin (isv-Latn-x-southern)',
  },
  {
    code: 'isv-Cyrl-x-southern',
    label: 'Southern Cyrillic (isv-Cyrl-x-southern)',
  },
  {
    code: 'isv-Latn-x-sloviant',
    label: 'Slovianto Latin (isv-Latn-x-sloviant)',
  },
  {
    code: 'isv-Cyrl-x-sloviant',
    label: 'Slovianto Cyrillic (isv-Cyrl-x-sloviant)',
  },
  { code: 'isv-Latn-PL', label: 'Polish Flavored Latin (isv-Latn-PL)' },
  { code: 'isv-Latn-x-ascii', label: 'ASCII Standard (isv-Latn-x-ascii)' },
];

BCP47_OPTIONS.forEach((opt) => {
  const el = document.createElement('option');
  el.value = opt.code;
  el.textContent = opt.label;
  if (opt.code === 'isv-Cyrl') el.selected = true;
  translitTarget.appendChild(el);
});

function updateTranslit() {
  const text = translitInput.value;
  const target = translitTarget.value as any;
  if (!text) {
    translitOutput.textContent = '';
    return;
  }
  try {
    const result = transliterate(text, target);
    translitOutput.textContent = result;
    if (target.includes('Glag')) {
      translitOutput.className = 'code-output font-glagolitic';
    } else {
      translitOutput.className = 'code-output font-interslavic';
    }
  } catch (err: any) {
    translitOutput.textContent = `Error: ${err?.message || err}`;
    translitOutput.className = 'code-output';
  }
}

translitInput.addEventListener('input', updateTranslit);
translitTarget.addEventListener('change', updateTranslit);

copyTranslitBtn.addEventListener('click', () => {
  if (translitOutput.textContent) {
    navigator.clipboard.writeText(translitOutput.textContent);
    copyTranslitBtn.textContent = 'Copied!';
    setTimeout(() => (copyTranslitBtn.textContent = 'Copy'), 1500);
  }
});
updateTranslit();

// ==========================================
// 2. INFLECTION & CONLL-U WIDGET
// ==========================================
const inflectWordInput = document.getElementById(
  'inflect-word',
) as HTMLInputElement;
const inflectXposInput = document.getElementById(
  'inflect-xpos',
) as HTMLSelectElement;
const inflectOutput = document.getElementById('inflect-output') as HTMLElement;
const inflectCount = document.getElementById('inflect-count') as HTMLElement;
const autodetectHint = document.getElementById(
  'autodetect-hint',
) as HTMLElement;
const derivedSection = document.getElementById(
  'derived-section',
) as HTMLElement;
const derivedChips = document.getElementById('derived-chips') as HTMLElement;

const CONLLU_HEADER =
  '# ID\tFORM\tLEMMA\tUPOS\tXPOS\tFEATS\tHEAD\tDEPREL\tDEPS\tMISC';

function updateInflect() {
  const word = inflectWordInput.value.trim();
  const rawXpos = inflectXposInput.value.trim();

  if (!word) {
    inflectOutput.textContent = '';
    inflectCount.textContent = '0 forms';
    autodetectHint.textContent = '';
    derivedChips.innerHTML = '';
    derivedSection.style.display = 'none';
    return;
  }

  // Update autodetect hint if xpos is not explicitly selected
  if (!rawXpos) {
    const detection = detectPos(word);
    autodetectHint.textContent = `Auto-detected: ${detection.label} (${detection.xpos}) via ${detection.reason}`;
  } else {
    autodetectHint.textContent = '';
  }

  try {
    const input = rawXpos ? { form: word, xpos: rawXpos } : word;
    const tokens = inflect(input as any);
    inflectCount.textContent = `${tokens.length} forms`;
    const formatted = formatTokens(tokens);
    inflectOutput.textContent = formatted
      ? `${CONLLU_HEADER}\n${formatted}`
      : '';

    // Render derived lexemes
    const derivedTokens = derive(input as any);
    if (derivedTokens.length > 0) {
      derivedSection.style.display = 'flex';
      derivedChips.innerHTML = '';
      derivedTokens.forEach((dt) => {
        const btn = document.createElement('button');
        btn.className = 'chip-derive';
        const code = dt.misc?.Derivation || dt.xpos || '';
        btn.innerHTML = `<strong>${dt.form}</strong> <span class="code-badge">${code}</span>`;
        btn.title = `Click to inflect ${dt.form} (${dt.xpos})`;
        btn.addEventListener('click', () => {
          inflectWordInput.value = dt.form;
          inflectXposInput.value = dt.xpos || '';
          updateInflect();
        });
        derivedChips.appendChild(btn);
      });
    } else {
      derivedSection.style.display = 'none';
      derivedChips.innerHTML = '';
    }
  } catch (err: any) {
    inflectCount.textContent = 'Error';
    inflectOutput.textContent = `Error: ${err?.message || err}`;
    derivedSection.style.display = 'none';
  }
}

inflectWordInput.addEventListener('input', updateInflect);
inflectXposInput.addEventListener('change', updateInflect);

const copyInflectBtn = document.getElementById(
  'copy-inflect',
) as HTMLButtonElement;
copyInflectBtn.addEventListener('click', () => {
  if (inflectOutput.textContent) {
    navigator.clipboard.writeText(inflectOutput.textContent);
    copyInflectBtn.textContent = 'Copied!';
    setTimeout(() => (copyInflectBtn.textContent = 'Copy'), 1500);
  }
});

document.querySelectorAll<HTMLButtonElement>('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    inflectWordInput.value = chip.dataset.word || '';
    inflectXposInput.value = chip.dataset.xpos || '';
    updateInflect();
  });
});
updateInflect();

// ==========================================
// 3. LEVENSHTEIN INTELLIGIBILITY WIDGET
// ==========================================
const levIsv = document.getElementById('lev-isv') as HTMLInputElement;
const levLang = document.getElementById('lev-lang') as HTMLSelectElement;
const levTarget = document.getElementById('lev-target') as HTMLInputElement;
const levScore = document.getElementById('lev-score') as HTMLElement;
const levDistance = document.getElementById('lev-distance') as HTMLElement;
const levVerdict = document.getElementById('lev-verdict') as HTMLElement;
const levFill = document.querySelector(
  '#lev-similarity-bar .fill',
) as HTMLElement;
const levAlignmentTable = document.getElementById(
  'lev-alignment-table',
) as HTMLElement;
const levAlignmentContainer = document.getElementById(
  'lev-alignment-container',
) as HTMLElement;

function updateLevenshtein() {
  const isv = levIsv.value.trim();
  const lang = levLang.value;
  const target = levTarget.value.trim();

  if (!isv || !target) {
    levScore.textContent = '—';
    levDistance.textContent = '—';
    levVerdict.textContent = 'Please provide both words';
    levFill.style.width = '0%';
    levAlignmentTable.innerHTML = '';
    levAlignmentContainer.style.display = 'none';
    return;
  }

  try {
    const details = distance(target, lang as any, isv, { details: true });
    const dist = details.distance;
    const similarity = Math.max(0, 1 - dist);
    const percent = Math.round(similarity * 100);

    levScore.textContent = `${percent}%`;
    levDistance.textContent = dist.toFixed(2);
    levFill.style.width = `${percent}%`;

    if (dist === 0) {
      levVerdict.textContent = 'Exact match (Identical root / Jat match)';
    } else if (dist <= 0.35) {
      levVerdict.textContent = 'Very close cognate (Minor phonetic variation)';
    } else if (dist <= 0.7) {
      levVerdict.textContent = 'Recognizable cognate';
    } else {
      levVerdict.textContent = 'Distant or unrelated word';
    }

    // Render alignment table
    if (details.alignment.length > 0) {
      levAlignmentContainer.style.display = 'block';
      levAlignmentTable.innerHTML = '';
      details.alignment.forEach((step) => {
        const col = document.createElement('div');
        col.className = `alignment-col op-${step.op}`;
        const charA = step.a || '—';
        const charB = step.b || '—';
        const opSymbol =
          step.op === 'equal'
            ? '='
            : step.op === 'substitute'
              ? `~ (${step.cost})`
              : step.op === 'insert'
                ? '+ (ins)'
                : '- (del)';

        col.innerHTML = `
          <div class="alignment-cell cell-a" title="Word A grapheme">${charA}</div>
          <div class="alignment-cell cell-b" title="Word B grapheme">${charB}</div>
          <div class="alignment-cell cell-op" title="Operation & cost">${opSymbol}</div>
        `;
        levAlignmentTable.appendChild(col);
      });
    } else {
      levAlignmentContainer.style.display = 'none';
      levAlignmentTable.innerHTML = '';
    }
  } catch (err: any) {
    levVerdict.textContent = `Error: ${err?.message || err}`;
    levAlignmentContainer.style.display = 'none';
  }
}

levIsv.addEventListener('input', updateLevenshtein);
levLang.addEventListener('change', updateLevenshtein);
levTarget.addEventListener('input', updateLevenshtein);

document.querySelectorAll<HTMLButtonElement>('.chip-lev').forEach((chip) => {
  chip.addEventListener('click', () => {
    levIsv.value = chip.dataset.isv || '';
    levTarget.value = chip.dataset.other || '';
    levLang.value = chip.dataset.lang || 'ru';
    updateLevenshtein();
  });
});
updateLevenshtein();

// ==========================================
// 4. LUNR SEARCH WIDGET
// ==========================================
const corpus = [
  {
    id: '1',
    text: 'V jedin zimny denj někaky seljanin vozvračal se od trga do doma, i bez malogo by zamrznul od hlada, ale, na ščestje, po dragě, na svojem putu, on našel krčmu v někakom večšem selu.',
  },
  {
    id: '2',
    text: 'Было уже полудње, а сељанин был гладны, и хтєл једати в крчмє, а заједно нагрєти се. Он привезал осла прєд крчмоју и вшел.',
  },
  {
    id: '3',
    text: 'Tam on uviděl množstvo ljudij iz togo sela, ktori grěli se okolo ognišča, ale dlja njego tam ne bylo města. Zato, on izmyslil směšnu metodu, kako možno pobuditi tamtyh okupantov, koji sěděli blizko ognišča, da by izšli von, na dvor.',
  },
  {
    id: '4',
    text: 'Он станул недалеко од двериј и гласно крикнул на крчмара: — Крчмаре, дај мнє једну порцију фасоље, а другу порцију принеси мојему ослу, кторы је привезаны прєд крчмоју, на двору.',
  },
  {
    id: '5',
    text: 'Nagromadženi seljani, udivjeni, naostrili svoje uši, i jedin iz njih jemu rěkl: — Pravda li, osel jedl by fasolju?! — Da, moj osel jedaje fasolju. Ako ne věrite, hodite s krčmarom i sami pogledajte.',
  },
  {
    id: '6',
    text: 'Крчмар принесл јему порцију фасоље и был зачинал нести ослу јего порцију фасоље, и тут вси ти сељани встали и послєдовали за њим заједно, и освободили мєсто около огња. Такто, наш хытры сељанин сєднул на тепло мєсто близко огнишча, и почел једати своју попрошену фасољу.',
  },
];

const searchIndex = lunr(function () {
  this.use((lunr as any).isv);
  this.ref('id');
  this.field('text');
  corpus.forEach((doc) => this.add(doc));
});

const lunrQuery = document.getElementById('lunr-query') as HTMLInputElement;
const lunrResults = document.getElementById('lunr-results') as HTMLElement;
const lunrCount = document.getElementById('lunr-count') as HTMLElement;

function highlightDocumentText(text: string, queryStems: Set<string>): string {
  if (queryStems.size === 0) return text;

  // Split text into tokens and delimiters while preserving all whitespace/punctuation
  const parts = text.split(/([\p{L}\p{M}\d_]+)/u);
  return parts
    .map((part) => {
      if (!part || !/[\p{L}\p{M}\d_]/u.test(part)) {
        return part;
      }
      const tokenStem = stem(part);
      if (tokenStem && queryStems.has(tokenStem)) {
        return `<mark class="search-highlight">${part}</mark>`;
      }
      return part;
    })
    .join('');
}

function updateLunr() {
  const q = lunrQuery.value.trim();
  lunrResults.innerHTML = '';

  const queryStems = new Set<string>();
  if (q) {
    const rawTokens = q.split(/[\s,.;:!?/()—"«»]+/u).filter(Boolean);
    for (const t of rawTokens) {
      const st = stem(t);
      if (st) queryStems.add(st);
    }
  }

  try {
    const hitMap = new Map<string, number>();
    if (q) {
      const hits = searchIndex.search(q);
      hits.forEach((h) => hitMap.set(h.ref, h.score));
      lunrCount.textContent = `${hits.length} hit(s)`;
    } else {
      lunrCount.textContent = `All ${corpus.length} paragraphs`;
    }

    corpus.forEach((doc) => {
      const isHit = hitMap.has(doc.id);
      const score = hitMap.get(doc.id);

      const item = document.createElement('div');
      item.className = `search-item ${q ? (isHit ? 'is-hit' : 'is-muted') : ''}`;

      const highlightedText = highlightDocumentText(doc.text, queryStems);

      item.innerHTML = `
        <div class="search-item-text font-interslavic">${highlightedText}</div>
      `;
      lunrResults.appendChild(item);
    });
  } catch (err: any) {
    lunrCount.textContent = 'Search error';
    lunrResults.textContent = err?.message || String(err);
  }
}

lunrQuery.addEventListener('input', updateLunr);
document.querySelectorAll<HTMLButtonElement>('.chip-lunr').forEach((chip) => {
  chip.addEventListener('click', () => {
    lunrQuery.value = chip.dataset.q || '';
    updateLunr();
  });
});
updateLunr();
