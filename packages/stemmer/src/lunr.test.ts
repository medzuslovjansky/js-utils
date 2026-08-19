import assert from 'node:assert';
import { describe, test } from 'node:test';

import lunr from 'lunr';

import {
  registerInterslavic,
  stopWordFilter,
  trimmer,
  type Lunr,
  type LunrToken,
} from './lunr.ts';

const DOCS = [
  { id: 'a', text: 'Medžuslovjansky jezyk jest zonalny konstruovany jezyk.' },
  { id: 'b', text: 'Vsi ljudi råždajųt sę svobodni i råvni v dostojnstvě.' },
  { id: 'c', text: 'Меджусловјанскы језык имаје дві азбукы.' },
  { id: 'd', text: 'Slovianski jezik je razumlivy vsim Slovianam.' },
];

function index() {
  registerInterslavic(lunr as unknown as Lunr);

  return lunr(function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.use((lunr as any).isv);
    this.ref('id');
    this.field('text');
    for (const doc of DOCS) this.add(doc);
  });
}

const hits = (query: string) =>
  index()
    .search(query)
    .map((r) => r.ref)
    .sort();

describe('the lunr plugin', () => {
  test('a query in one script finds documents written in another', () => {
    // `a` is Latin, `c` is Cyrillic, and neither spells the word the way the
    // query does
    assert.deepStrictEqual(hits('medzuslovjanski'), ['a', 'c']);
  });

  test('an inflected query finds the other forms of the word', () => {
    assert.deepStrictEqual(hits('jezykov'), ['a', 'c', 'd']);
  });

  test('the northern flavorisation and the standard reach each other', () => {
    // `d` writes it `Slovianski`; lunr matches whole terms, so the compound in
    // `a` and `c` is a different word and rightly stays out
    assert.deepStrictEqual(hits('slovjansky'), ['d']);
  });

  test('a diacritic in the corpus is not required in the query', () => {
    assert.deepStrictEqual(hits('razdati'), ['b']);
  });

  test('stop words are not indexed', () => {
    assert.deepStrictEqual(hits('i'), []);
    assert.deepStrictEqual(hits('v'), []);
  });

  test('an index survives a serialize/load round trip', () => {
    const loaded = lunr.Index.load(JSON.parse(JSON.stringify(index())));
    assert.deepStrictEqual(
      loaded
        .search('jezyk')
        .map((r) => r.ref)
        .sort(),
      ['a', 'c', 'd'],
    );
  });
});

describe('the pipeline functions on their own', () => {
  const token = (value: string): LunrToken => ({
    toString: () => value,
    update(fn) {
      return token(fn(value));
    },
  });

  test('the trimmer keeps letters lunr would have thrown away', () => {
    // lunr's own trimmer is `\W`-based and would leave nothing of either
    assert.strictEqual(trimmer(token('«pěsȯk»')).toString(), 'pěsȯk');
    assert.strictEqual(trimmer(token('...језык!')).toString(), 'језык');
  });

  test('the stop word filter drops a stem and keeps a word', () => {
    assert.strictEqual(stopWordFilter(token('za')), undefined);
    assert.notStrictEqual(stopWordFilter(token('dom')), undefined);
  });

  test('registering does not require a search pipeline', () => {
    const fake = {
      Pipeline: { registerFunction: () => {} },
      tokenizer: { separator: /\s+/ },
    } as unknown as Lunr;
    registerInterslavic(fake);

    const pipeline = { reset: () => {}, add: () => {} };
    assert.doesNotThrow(() =>
      (fake.isv as (this: { pipeline: typeof pipeline }) => void).call({
        pipeline,
      }),
    );
  });
});
