#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('node:fs');
const path = require('node:path');
const { Writable } = require('node:stream');

const csvParse = require('csv-parse').parse;
const fetch = require('node-fetch');
const WORDS_URL =
  'https://docs.google.com/spreadsheets/d/1N79e_yVHDo-d026HljueuKJlAAdeELAiPzdFzdBuKbY/export?format=csv&gid=1987833874';

const CACHE_DIR = path.join(__dirname, '../.cache');
const FIXTURES_DIR = path.join(__dirname, '../src/__fixtures__');
const WORDS_SHEET = path.join(CACHE_DIR, 'words.csv');

const FIXTURE_ADJECTIVES = path.join(FIXTURES_DIR, 'adjectives.json');

const FIXTURE_NOUNS_MASCULINE = path.join(FIXTURES_DIR, 'nouns-masculine.json');
const FIXTURE_NOUNS_MASCULINE_ANIMATE = path.join(
  FIXTURES_DIR,
  'nouns-masculine-animate.json',
);
const FIXTURE_NOUNS_FEMININE = path.join(FIXTURES_DIR, 'nouns-feminine.json');
const FIXTURE_NOUNS_NEUTER = path.join(FIXTURES_DIR, 'nouns-neuter.json');
const FIXTURE_NOUNS_OTHER = path.join(FIXTURES_DIR, 'nouns-misc.json');

const FIXTURE_VERBS_PERFECT = path.join(FIXTURES_DIR, 'verbs-perfect.json');
const FIXTURE_VERBS_IMPERFECT = path.join(FIXTURES_DIR, 'verbs-imperfect.json');
const FIXTURE_VERBS_OTHER = path.join(FIXTURES_DIR, 'verbs-misc.json');

const FIXTURE_PRONOUNS_DEMONSTRATIVE = path.join(
  FIXTURES_DIR,
  'pronouns-demonstrative.json',
);
const FIXTURE_PRONOUNS_INDEFINITE = path.join(
  FIXTURES_DIR,
  'pronouns-indefinite.json',
);
const FIXTURE_PRONOUNS_INTERROGATIVE = path.join(
  FIXTURES_DIR,
  'pronouns-interrogative.json',
);
const FIXTURE_PRONOUNS_PERSONAL = path.join(
  FIXTURES_DIR,
  'pronouns-personal.json',
);
const FIXTURE_PRONOUNS_POSSESSIVE = path.join(
  FIXTURES_DIR,
  'pronouns-possessive.json',
);
const FIXTURE_PRONOUNS_RECIPROCAL = path.join(
  FIXTURES_DIR,
  'pronouns-reciprocal.json',
);
const FIXTURE_PRONOUNS_REFLEXIVE = path.join(
  FIXTURES_DIR,
  'pronouns-reflexive.json',
);
const FIXTURE_PRONOUNS_RELATIVE = path.join(
  FIXTURES_DIR,
  'pronouns-relative.json',
);
const FIXTURE_OTHER = path.join(FIXTURES_DIR, 'other.json');

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  return new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

async function downloadWords() {
  if (fs.existsSync(WORDS_SHEET)) {
    console.log("The 'words' sheet is already downloaded.");
    return;
  }

  console.log("Downloading the 'words' sheet...");
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  await downloadFile(WORDS_URL, WORDS_SHEET);
  console.log('OK');
}

async function splitToFixtures() {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });

  const fileStream = fs.createReadStream(WORDS_SHEET);
  const csvParser = csvParse({ columns: true });

  const adjectives = {
    o: new JSONLFileStream({ filePath: FIXTURE_ADJECTIVES }),
  };
  const nouns = {
    m: new JSONLFileStream({ filePath: FIXTURE_NOUNS_MASCULINE }),
    m_anim: new JSONLFileStream({ filePath: FIXTURE_NOUNS_MASCULINE_ANIMATE }),
    f: new JSONLFileStream({ filePath: FIXTURE_NOUNS_FEMININE }),
    n: new JSONLFileStream({ filePath: FIXTURE_NOUNS_NEUTER }),
    o: new JSONLFileStream({ filePath: FIXTURE_NOUNS_OTHER }),
  };
  const verbs = {
    pf: new JSONLFileStream({ filePath: FIXTURE_VERBS_PERFECT }),
    ipf: new JSONLFileStream({ filePath: FIXTURE_VERBS_IMPERFECT }),
    o: new JSONLFileStream({ filePath: FIXTURE_VERBS_OTHER }),
  };
  const pronouns = {
    dem: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_DEMONSTRATIVE }),
    indef: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_INDEFINITE }),
    int: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_INTERROGATIVE }),
    pers: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_PERSONAL }),
    poss: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_POSSESSIVE }),
    rec: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_RECIPROCAL }),
    refl: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_REFLEXIVE }),
    rel: new JSONLFileStream({ filePath: FIXTURE_PRONOUNS_RELATIVE }),
  };
  const other = new JSONLFileStream({ filePath: FIXTURE_OTHER });

  const findStream = (pos) => {
    if (/\badj\./.test(pos)) {
      return adjectives.o;
    } else if (/\b[mfn]\./.test(pos)) {
      const isMasculine = /\bm\./.test(pos);
      const isFeminine = /\bf\./.test(pos);
      const isNeuter = /\bn\./.test(pos);

      const genders =
        Number(isMasculine) + Number(isFeminine) + Number(isNeuter);

      if (genders !== 1) {
        return nouns.o;
      }

      if (isFeminine) {
        return nouns.f;
      }

      if (isNeuter) {
        return nouns.n;
      }

      const isAnimate = /\banim\./.test(pos);
      return isAnimate ? nouns.m_anim : nouns.m;
    } else if (/^v\./.test(pos)) {
      const isPerfective = /\bpf\./.test(pos);
      const isImperfective = /\bipf\./.test(pos);

      if (isPerfective === isImperfective) {
        return verbs.o;
      }

      if (isPerfective) {
        return verbs.pf;
      }

      if (isImperfective) {
        return verbs.ipf;
      }

      return verbs;
    } else if (/^pron\./.test(pos)) {
      const subtype = pos.split('.')[1].trim();
      if (!pronouns[subtype]) {
        throw new Error(`Unknown pronoun type: ${pos}`);
      }

      return pronouns[subtype];
    } else {
      return other;
    }
  };

  const visited = new Set();
  const csvRecords = fileStream.pipe(csvParser);
  let counter = 0;
  for await (const record of csvRecords) {
    counter++;

    const morphology = stripHash(record.partOfSpeech);
    const stream = findStream(morphology);
    if (!stream) {
      continue;
    }

    const isv = stripSquareBrackets(stripHash(record.isv));
    const lemmas = isv.split(/\s*,\s*/);
    for (const lemma of lemmas) {
      const extra = stripHash(record.addition);
      const key = `${morphology}:${lemma}:${extra}`;
      if (visited.has(key)) {
        continue;
      }

      const id = stripHash(record.id) + String(-lemmas.indexOf(lemma) || '');
      const row = [id, morphology, lemma, extra];
      stream.write(row);
      visited.add(key);
    }
  }

  await Promise.all(
    [
      ...Object.values(adjectives),
      ...Object.values(nouns),
      ...Object.values(verbs),
    ].map(
      (stream) =>
        new Promise((resolve, reject) => {
          stream.end((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }),
    ),
  );

  console.log(`Processed ${counter} records...`);
}

async function main() {
  await downloadWords();
  await splitToFixtures();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exitCode = 1;
});

function stripHash(str) {
  return str.replace(/#/g, '');
}

function stripSquareBrackets(str) {
  return str.replace(/\s*\[[^\]]+\]\s*/g, '');
}

class JSONLFileStream extends Writable {
  constructor(options) {
    super({ objectMode: true });
    this._fileDescriptor = Number.NaN;
    this._offset = Number.NaN;
    this._counter = 0;
    this._filePath = options.filePath;
  }
  _construct(callback) {
    this._offset = 0;
    this._fileDescriptor = fs.openSync(this._filePath, 'w');
    const content = Buffer.from('[]\n');
    fs.write(
      this._fileDescriptor,
      content,
      this._offset,
      content.length,
      (error) => {
        if (error) {
          callback(error);
        } else {
          this._offset += 1;
          callback();
        }
      },
    );
  }
  _write(chunk, _, callback) {
    const content =
      this._counter++ > 0
        ? `,\n${JSON.stringify(chunk)}]\n`
        : `${JSON.stringify(chunk)}]\n`;
    const buffer = Buffer.from(content);
    fs.write(
      this._fileDescriptor,
      buffer,
      0,
      buffer.length,
      this._offset,
      (error, bytesWritten) => {
        if (error) {
          callback(error);
        } else {
          this._offset += bytesWritten - 2;
          callback();
        }
      },
    );
  }
  _final(callback) {
    fs.close(this._fileDescriptor, callback);
  }
}
