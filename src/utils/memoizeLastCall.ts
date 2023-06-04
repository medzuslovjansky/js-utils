/* eslint-disable prefer-rest-params */
import { areArraysEqual } from './areArraysEqual';

export function memoizeLastCall<T extends (...args: any[]) => any>(func: T): T {
  let lastArgs: IArguments;
  let lastResult: ReturnType<T>;

  function memoized(): ReturnType<T> {
    if (lastArgs && areArraysEqual(arguments, lastArgs)) {
      return lastResult;
    }

    lastArgs = arguments;
    lastResult = func(...arguments);
    return lastResult;
  }

  return memoized as T;
}
