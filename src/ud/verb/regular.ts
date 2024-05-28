import { conjugationVerb, SteenVerbParadigm } from '../../verb';
import { Verb, VerbFeatures } from './types';

export function getRegularForms(
  lemma: string,
  additional: string,
  inheritedFeats: VerbFeatures,
): Verb[] {
  const paradigm = conjugationVerb(lemma, additional);
  if (!paradigm) {
    throw new Error(`No paradigm found for verb ${lemma}`);
  }

  return [
    getInfinitive,
    getPresentSg1,
    getPresentSg2,
    getPresentSg3,
    getPresentPl1,
    getPresentPl2,
    getPresentPl3,
    // ...
    getImperative,
  ].flatMap((callback): Verb[] => {
    const maybeForms = callback(paradigm);
    const forms = Array.isArray(maybeForms) ? maybeForms : [maybeForms];
    const result: Verb[] = [];
    for (const item of forms) {
      const { form, feats } = item;

      result.push({
        form,
        lemma: paradigm.infinitive,
        uPosTag: 'VERB',
        feats: {
          ...inheritedFeats,
          ...feats,
        },
      });
    }

    return result;
  });
}

type VerbForm = Pick<Verb, 'form' | 'feats'>;

function getPresentSg1(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[0],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '1',
      number: 'Sing',
    },
  };
}

function getPresentSg2(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[1],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '2',
      number: 'Sing',
    },
  };
}

function getPresentSg3(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[2],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '3',
      number: 'Sing',
    },
  };
}

function getPresentPl1(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[3],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '1',
      number: 'Plur',
    },
  };
}

function getPresentPl2(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[4],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '2',
      number: 'Plur',
    },
  };
}

function getPresentPl3(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.present[5],
    feats: {
      mood: 'Ind',
      tense: 'Pres',
      person: '3',
      number: 'Plur',
    },
  };
}

// Add similar functions for the remaining verb forms (imperfect, perfect, pluperfect, future, conditional)

function getInfinitive(paradigm: SteenVerbParadigm): VerbForm {
  return {
    form: paradigm.infinitive,
    feats: {
      verbForm: 'Inf',
    },
  };
}

function getImperative(paradigm: SteenVerbParadigm): VerbForm[] {
  const [sg2, pl1, pl2] = paradigm.imperative.split(', ');
  const mood = 'Imp';

  return [
    {
      form: sg2,
      feats: { mood, person: '2', number: 'Sing' },
    },
    {
      form: pl1,
      feats: { mood, person: '1', number: 'Plur' },
    },
    {
      form: pl2,
      feats: { mood, person: '2', number: 'Plur' },
    },
  ];
}
