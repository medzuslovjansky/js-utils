import { mapStep, regexStep, type Step } from '../steps.ts';

const SOFT: Readonly<Record<string, string>> = {
  c: 'tj',
  s: 'sj',
  z: 'zj',
  dz: 'dj',
  n: 'nj',
};

const palatals = mapStep('pl-soften', {
  ć: 'tj',
  ś: 'sj',
  ź: 'zj',
  dź: 'dj',
  ń: 'nj',
});

export const pl: readonly Step[] = [
  // rz→rj honors the j-glide principle and matches ISV rj (morze→morje);
  // digraphs run first so sz is consumed before the si-softening rule can misfire
  // after labials/velars/l the i of ie only marks softness, as ru е does
  // (bieda→beda like беда→beda); c s z n dz are left to pl-soften (życie→žytje)
  regexStep('pl-ie', /(?<=[bpmwfkgl])ie/g, 'e'),
  mapStep('pl-digraphs', { cz: 'č', sz: 'š', rz: 'rj', ch: 'h', dż: 'dž' }),
  {
    name: 'pl-soften',
    // ci/si/zi/dzi/ni: mute i before a vowel (siostra→sjostra), kept before a
    // consonant (cicho→tjiho); pl palatals land where ISV soft consonants fold
    // (być→bytj vs ISV byti, koń→konj)
    apply: (word) =>
      palatals.apply(
        word
          .replace(/(dz|[cszn])i(?=[aąeęioóuy])/g, (_m, g: string) => SOFT[g]!)
          .replace(
            /(dz|[cszn])i(?![aąeęioóuy])/g,
            (_m, g: string) => SOFT[g]! + 'i',
          ),
      ),
  },
  // ą→u from ISV ų (dąb→dub), ę→e from ISV ę (mięso→ISV męso→meso), ó→o (góra→gora)
  mapStep('pl-letters', { ż: 'ž', ó: 'o', ł: 'l', w: 'v', ą: 'u', ę: 'e' }),
];
