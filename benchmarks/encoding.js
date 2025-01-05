const fs = require('node:fs');
const path = require('node:path');
const Benchmark = require('benchmark');

// Import your encoder/decoder
const { DictionaryEncoding } = require('..');

// Directory containing fixture files
const FIXTURE_DIR = path.join(__dirname, '../src/__fixtures__');

// Get random value from array
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to read all fixture files
function loadFixtures(dir) {
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));
  const data = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extract lemma from each array entry
    const lemmas = content.map((entry) => entry[2]);
    data.push(...lemmas);
  }

  return data;
}

function baselineEncode(str) {
  return str.normalize('NFD').split('');
}

function baselineDecode(arr) {
  return arr.join('').normalize('NFC');
}

// Small side effect storage
let sideEffectAccumulator = 0;

// Main function
function main() {
  // Load all lemmas from fixtures
  const lemmas = loadFixtures(FIXTURE_DIR);

  const encodedData1 = lemmas.map(baselineEncode);
  const encodedData2 = lemmas.map(DictionaryEncoding.encode);

  // Create a benchmark suite
  const suite = new Benchmark.Suite();

  suite.add('Baseline Encoder', () => {
    const result = baselineEncode(sample(lemmas));
    sideEffectAccumulator += result.length; // Small side effect
  });

  suite.add('Custom Encoder', () => {
    const encoded = DictionaryEncoding.encode(sample(lemmas));
    sideEffectAccumulator += encoded.length; // Small side effect
  });

  // Add baseline normalization
  suite.add('Baseline Decoder', () => {
    const result = baselineDecode(sample(encodedData1));
    sideEffectAccumulator += result.length; // Small side effect
  });

  // Add custom encoder
  suite.add('Custom Decoder', () => {
    const encoded = DictionaryEncoding.decode(sample(encodedData2));
    sideEffectAccumulator += encoded.length; // Small side effect
  });

  // On each benchmark cycle
  suite.on('cycle', (event) => {
    console.log(String(event.target));
  });

  // On benchmark completion
  suite.on('complete', function () {
    console.log('Fastest is:', this.filter('fastest').map('name'));
    console.log('Final sideEffectAccumulator:', sideEffectAccumulator); // Log side effect to prevent optimization
  });

  // Run benchmarks
  suite.run({ async: true });
}

// Execute the script
main();
