import vm from 'node:vm';

import type { TestCaseResult } from '@jest/reporters';

import { SteenVerbParadigm } from '../verb';
import { SteenNounParadigm } from '../noun';
import { SteenAdjectiveParadigm } from '../adjective';

import * as html from './html';

type Tuple<T> = [T, T];
type TupleProcessor<T> = (diff: Tuple<T>) => string;

export function toHTML(test: TestCaseResult) {
  const renderer = getRenderer(test);
  const figures = renderer ? getBeforeAndAfter(test).map(renderer) : [];
  return figures.map((figure) => figure + '\n\n').join('');
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

function getRenderer(
  test: TestCaseResult,
): TupleProcessor<unknown> | undefined {
  const partOfSpeech = test.ancestorTitles[0];
  switch (partOfSpeech) {
    case 'verb':
      return (tuple) =>
        html.verb.renderDiff(...(tuple as Tuple<SteenVerbParadigm>));
    case 'noun':
      return (tuple) =>
        html.noun.renderDiff(...(tuple as Tuple<SteenNounParadigm>));
    case 'adjective':
      return (tuple) =>
        html.adjective.renderDiff(...(tuple as Tuple<SteenAdjectiveParadigm>));
    default:
      return;
  }
}
