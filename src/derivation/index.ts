let counter_derived = 0;
const found_forms = {
  prap: [],
  prpp: [],
  pfpp: [],
  pfap: [],
  vnoun: [],
  comparative: [],
  superlative: [],
};
for (const row of derivation_queue) {
  const [id, morphology, lemma, extra] = row;
  let wordData;
  if (/^v\./.test(morphology)) {
    let add_id = 0;
    // verb2noun
    if (lemma.startsWith('ne ')) {
      // things like "ne poslušańje"
      continue;
    }
    wordData = conjugationVerb.conjugationVerb(lemma, extra);
    if (!wordData) {
      console.log(row);
      continue;
    }
    const new_noun = wordData.gerund;
    const noun_key = `n.:${new_noun}:`;
    if (visited.has(noun_key)) {
      // add verbForm=Vnoun to its POS?
      if (found_forms['vnoun'].includes(new_noun)) {
        continue;
      }
      found_forms['vnoun'].push(new_noun);
    } else {
      const noun_row = [id + '>' + add_id, '#n.vnoun.', new_noun, ''];
      add_id++;
      nouns.n.write(noun_row);
      const new_noun_key = `n.vnoun.:${new_noun}:`;
      visited.add(new_noun_key);
      counter_derived++;
    }
    // verb2adj
    for (const adj_type of ['prap', 'prpp', 'pfap', 'pfpp']) {
      const new_adj = wordData[adj_type];
      const new_adj_lemma = new_adj.split(' ')[0].trim();
      const key = `adj.:${new_adj_lemma}:`;
      const new_key = `adj.ptcp.:${new_adj_lemma}:`;
      if (visited.has(new_key)) {
        continue;
      }
      if (!conjugationVerb.isParticipleValid(adj_type, morphology)) {
        if (visited.has(key)) {
          console.log('forbidden form encountered!');
        }
        continue;
      }
      if (visited.has(key)) {
        // add verbForm=Part to its POS?
        if (found_forms[adj_type].includes(new_adj_lemma)) {
          continue;
        }
        found_forms[adj_type].push(new_adj_lemma);
        continue;
      }
      const new_row = [id + '>' + add_id, '#adj.ptcp.', new_adj_lemma, ''];
      add_id++;
      adjectives.o.write(new_row);
      visited.add(new_key);
      counter_derived++;
    }
  }
}
let counter_derived_existing = 0;
for (const adj_type of [
  'prap',
  'prpp',
  'pfap',
  'pfpp',
  'vnoun',
  'comparative',
  'superlative',
]) {
  counter_derived_existing =
    counter_derived_existing + found_forms[adj_type].length;

  console.log(adj_type, found_forms[adj_type].length);
  console.log(found_forms[adj_type]);
}
