import { Genesis } from '../types';
import buildCastToEnum from '../utils/buildCastToEnum';

const asGenesis = buildCastToEnum(Genesis);

export default function parseGenesis(rawValue: string): keyof typeof Genesis {
  const value = asGenesis(rawValue?.toUpperCase());
  if (!value) {
    throw new Error(`Failed to parse word genesis: ${rawValue}`);
  }

  return value;
}
