import _ from 'lodash';
import { Word } from '../types';

export function formatAsUDPipe(data: Word[]) {
  const headers = ['Form', 'Lemma', 'uPosTag', 'Feats'];
  const rows = data.map((item) => [
    item.form,
    item.lemma,
    item.uPosTag,
    _.chain(item.feats)
      .toPairs()
      .map((pair) => _.upperFirst(pair.join('=')))
      .join('|')
      .value(),
  ]);

  const headerRow = `${headers.join('\t')}`;
  const dataRows = rows.map((row) => row.join('\t')).join('\n');

  return `${headerRow}\n${dataRows}`;
}
