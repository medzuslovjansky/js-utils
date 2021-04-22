import { Lemma } from './Lemma';

export type Synset = {
  meta: {
    autotranslated: boolean;
    debatable: boolean;
  };
  options: Lemma[];
};
