import { VoteStatus } from '../types';
import buildCastToEnum from '../utils/buildCastToEnum';

const asVoteStatus = buildCastToEnum(VoteStatus);

export default function parseGenesis(
  rawValue: string | number,
): keyof typeof VoteStatus {
  const value = asVoteStatus(Number(rawValue));
  if (!value) {
    throw new Error(`Failed to parse vote status: ${rawValue}`);
  }

  return value;
}
