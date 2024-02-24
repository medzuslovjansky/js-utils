import vm from 'node:vm';
import type { TestCaseResult } from '@jest/reporters';
import { transliterate } from '..';
import { toMarkdown as verb } from '../verb/__utils__/toMarkdown';
import { SteenVerbParadigm } from '../verb';

type Tuple<T> = [T, T];
type TupleProcessor<T> = (diff: Tuple<T>) => string;

export function toMarkdown(test: TestCaseResult) {
  const processor = getMarkdownProcessor(test);
  const tables = processor ? getBeforeAndAfter(test).map(processor) : [];
  return transliterate(
    tables.map((table) => table + '\n\n').join(''),
    'art-Latn-x-interslv-etym',
  );
}

function getBeforeAndAfter(test: TestCaseResult): Tuple<unknown>[] {
  return (test.failureDetails as any[])
    .map((failure) => failure?.matcherResult)
    .filter(
      (matcherResult) =>
        matcherResult && matcherResult.expected && matcherResult.actual,
    )
    .map((failure) =>
      vm.runInNewContext(`[${failure.expected}, ${failure.actual}]`),
    );
}

function getMarkdownProcessor(
  test: TestCaseResult,
): TupleProcessor<unknown> | undefined {
  const partOfSpeech = test.ancestorTitles[0];
  switch (partOfSpeech) {
    case 'verb':
      return (tuple) => verb(tuple as Tuple<SteenVerbParadigm>);
    default:
      return;
  }
}
