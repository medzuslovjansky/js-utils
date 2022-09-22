export enum TransliterationType {
  Latin = 1,
  ASCII = 2,
  Polish = 3,
  StandardCyrillic = 5,
  TraditionalIotatedCyrillic = 6,
  Glagolitic = 7,
  IPA = 10,
}

export enum FlavorizationType {
  CyrillicExtended = 1,
  Etymological = 2,
  Standard = 3,
  Slovianto = 4,
  Southern = 'J',
  Northern = 'S',
}

/**
 * @param iSource
 * @param type
 * @param flav
 * @see {@link http://steen.free.fr/scripts/transliteration.js}
 */
export function transliterate(
  iSource: string,
  type: number,
  flav: string | number = 2,
): string {
  return iSource
    .normalize('NFC')
    .replace(/\p{Letter}+/gu, (w) => transliterateWord(w, type, flav));
}

function transliterateWord(
  iW: string,
  type: string | number,
  flav: string | number,
) {
  let vowel;

  //symbol % marks the borders of the %word%
  iW = '%' + iW + '%';
  let OrigW = iW;
  iW = iW.toLowerCase();
  iW = iW.replace(/ľ/g, 'ĺ');
  iW = iW.replace(/ň/g, 'ń');
  // 'ŕ' remains between two consonants, in other cases is replaced by 'ř'
  iW = iW.replace(/ŕ/g, 'ř');
  const aPos = iW.indexOf('ř');
  vowel = /[aeiouyąęųåėȯèòěê]/;
  if (
    aPos > 1 &&
    iW.charAt(aPos - 1) != '%' &&
    vowel.test(iW.charAt(aPos - 1)) == false &&
    vowel.test(iW.charAt(aPos + 1)) == false
  ) {
    iW = iW.substring(0, aPos) + 'ŕ' + iW.substring(aPos + 1, iW.length);
  }

  // 'r' is replaced by 'ŕ' or 'ṙ' between two consonants except 'j': 'ŕ' after [šžčc], 'ṙ' in other cases
  iW = iW.replace(/rj/g, 'Rj');
  iW = iW.replace(/jr/g, 'jR');
  const rPos = iW.indexOf('r');
  vowel = /[aeiouyąęųåėȯèòěê]/;
  if (
    rPos > 1 &&
    iW.charAt(rPos - 1) != '%' &&
    vowel.test(iW.charAt(rPos - 1)) == false &&
    vowel.test(iW.charAt(rPos + 1)) == false
  ) {
    iW = iW.substring(0, rPos) + 'ṙ' + iW.substring(rPos + 1, iW.length);
    // iW = iW.replace (/’ṙ/, "ṙ");
    // iW = iW.replace (/jṙ/, "ŕ");
    iW = iW.replace(/([šžčc])ṙ/g, '$1ŕ');
  }
  iW = iW.replace(/R/g, 'r');
  // 'x' is replaced by 'ks'
  iW = iW.replace(/x/g, 'ks');
  // inserting auxiliary symbol 'ı' after soft consonants
  iW = iW.replace(/([ńĺřťďśź])j/g, '$1ıj');
  // interting delimiter # in some cases
  iW = iW.replace(/([dsz])j/g, '$1#j');
  iW = iW.replace(/%obj/g, 'ob#j');
  iW = iW.replace(/%neobj/g, 'neob#j');
  iW = iW.replace(/%vj/g, 'v#j');

  /* FLAVORIZACIJE */

  // 2 - ethymological, 3 - standard, 4 - slovianto
  if (flav == '2' || flav == '3' || flav == '4') {
    iW = iW.replace(/ê/g, 'ě');
    iW = iW.replace(/ȯ%/g, 'o%');
    iW = iW.replace(/ŭ/g, 'v');
    iW = iW.replace(/[ṱḓ]/g, '');
    iW = iW.replace(/[’`]/g, '#%');
    iW = iW.replace(/([čšžj])ě/g, '$1e');
  }
  // 3 - standard, 4 - slovianto
  if (flav == '3' || flav == '4') {
    iW = iW.replace(/[ęė]/g, 'e');
    iW = iW.replace(/å/g, 'a');
    iW = iW.replace(/ȯ/g, 'o');
    iW = iW.replace(/ų/g, 'u');
    iW = iW.replace(/ć/g, 'č');
    iW = iW.replace(/đ/g, 'dž');
    iW = iW.replace(/ř/g, 'r');
    iW = iW.replace(/ĺ/g, 'l');
    iW = iW.replace(/ń/g, 'n');
    iW = iW.replace(/ť/g, 't');
    iW = iW.replace(/ď/g, 'd');
    iW = iW.replace(/ś/g, 's');
    iW = iW.replace(/ź/g, 'z');
  }
  // slovianto
  if (flav == '4') {
    iW = iW.replace(/ě/g, 'e');
    iW = iW.replace(/y/g, 'i');
  }
  // northern flavorisation
  else if (flav == 'S') {
    iW = iW.replace(/ć/g, 'č');
    iW = iW.replace(/đ/g, 'dž');
    iW = iW.replace(/ṱ/g, 't');
    iW = iW.replace(/ḓ/g, 'd');
    iW = iW.replace(/[êė]/g, 'e');
    iW = iW.replace(/[åȯ]/g, 'o');
    iW = iW.replace(/ų/g, 'u');
    iW = iW.replace(/ŭ/g, 'v');
    iW = iW.replace(/([šžčcj])ę/g, '$1a');
    iW = iW.replace(/ę/g, 'ja');
    iW = iW.replace(/([šžčcj])ě/g, '$1e');
    iW = iW.replace(/([ŕṙ])%/g, 'r%');
    iW = iW.replace(/ṙ/g, 'or');
    iW = iW.replace(/ŕ/g, 'er');
    iW = iW.replace(/([kgh])y/g, '$1i');
    iW = iW.replace(/[`’]/g, '#%');
  }
  // southern flavorisation
  else if (flav == 'J') {
    iW = iW.replace(/ų/g, 'u');
    iW = iW.replace(/ŭ/g, 'v');
    iW = iW.replace(/ĺ/g, 'l');
    iW = iW.replace(/ř/g, 'r');
    iW = iW.replace(/ń/g, 'n');
    iW = iW.replace(/ť/g, 't');
    iW = iW.replace(/ď/g, 'd');
    iW = iW.replace(/ś/g, 's');
    iW = iW.replace(/ź/g, 'z');
    iW = iW.replace(/šč/g, 'št');
    iW = iW.replace(/[ṱḓ]/g, '');
    iW = iW.replace(/å/g, 'a');
    iW = iW.replace(/[ęė]/g, 'e');
    iW = iW.replace(/ê/g, 'ě');
    iW = iW.replace(/y/g, 'i');
    iW = iW.replace(/ȯ%/g, 'o%');
    iW = iW.replace(/([šžčcj])ě/g, '$1e');
    iW = iW.replace(/[`’]/g, '#%');
    iW = iW.replace(/ı/g, '');
  }

  /* PISMA I PRAVOPISY */

  /* Latin alphabet */
  if (type == 1) {
    //ethymological
    if (flav == '2') {
      iW = iW.replace(/ṙ/g, 'r');
      iW = iW.replace(/ř/g, 'ŕ');
      iW = iW.replace(/ĺ/g, 'ĺ');
      iW = iW.replace(/ť/g, 't́');
      iW = iW.replace(/ď/g, 'd́');
      iW = iW.replace(/([čšžj])ŕ/g, '$1r');
    }
    //standard, slovianto, southern
    else if (flav == '3' || flav == '4' || flav == 'J') {
      iW = iW.replace(/[ṙŕ]/g, 'r');
      iW = iW.replace(/ȯ/g, 'ă');
    }
    //northern
    else if (flav == 'S') {
      iW = iW.replace(/ě/g, 'ьe');
      iW = jgedoe(iW);
      iW = iW.replace(/Ьıь/g, 'i');
      iW = iW.replace(/([čšžj])ь/g, '$1i');
      iW = iW.replace(/ь/g, 'i');
      /* iW = iW.replace (/li/g,"lii");
      iW = iW.replace (/l/g,"ł");
      iW = iW.replace (/łe/g,"le");
      iW = iW.replace (/łi/g,"l");
      iW = iW.replace (/ii/g,"i");
      iW = iW.replace (/łi/g,"l");
      iW = iW.replace (/łЬ/g,"l"); */
      iW = iW.replace(/h/g, 'ch');
      iW = iW.replace(/lЬ/g, 'ĺ');
      iW = iW.replace(/nЬ/g, 'ń');
      iW = iW.replace(/rЬ/g, 'ŕ');
      iW = iW.replace(/tЬ/g, 'ť');
      iW = iW.replace(/dЬ/g, 'ď');
      iW = iW.replace(/sЬ/g, 'ś');
      iW = iW.replace(/zЬ/g, 'ź');
      iW = iW.replace(/Ь/g, 'j');
    }
  } else if (type == 2) {
    /* ASCII */
    iW = iW.replace(/[ṙŕ]/g, 'r');
    iW = iW.replace(/š/g, 'sz');
    iW = iW.replace(/[ćč]/g, 'cz');
    iW = iW.replace(/ž/g, 'zs');
    iW = iW.replace(/đ/g, 'dzs');
    iW = iW.replace(/ě/g, 'je');
    iW = iW.replace(/å/g, 'a');
    iW = iW.replace(/[ęė]/g, 'e');
    iW = iW.replace(/ȯ/g, 'o');
    iW = iW.replace(/ų/g, 'u');
  } else if (type == 3) {
    /* Polish alphabet */
    iW = jgedoe(iW);
    iW = iW.replace(/å/g, 'a');
    iW = iW.replace(/ė/g, 'e');
    iW = iW.replace(/ě/g, 'ьe');
    iW = iW.replace(/ȯ/g, 'o');
    iW = iW.replace(/ṙ/g, 'or');
    iW = iW.replace(/ŕ/g, 'er');
    iW = iW.replace(/ŭ/g, 'u');
    iW = iW.replace(/[ṱḓ’]/g, '');
    iW = iW.replace(/lь/g, 'ĺ');
    iW = iW.replace(/lЬ/g, 'ĺ');
    iW = iW.replace(/li/g, 'ĺi');
    iW = iW.replace(/rzь/g, 'rz');
    iW = iW.replace(/ь/g, 'i');
    iW = iW.replace(/Ь/g, 'ь');
    iW = iW.replace(/ьý/g, 'ьí');
    iW = iW.replace(/ų/g, 'ą');
    iW = iW.replace(/š/g, 'sz');
    iW = iW.replace(/č/g, 'cz');
    iW = iW.replace(/rь/g, 'ŕ');
    iW = iW.replace(/ž/g, 'ż');
    iW = iW.replace(/v/g, 'w');
    iW = iW.replace(/h/g, 'ch');
    iW = iW.replace(/l/g, 'ł');
    iW = iW.replace(/ĺ/g, 'l');
    iW = iW.replace(/tь/g, 'ť');
    iW = iW.replace(/ti/g, 'ti');
    iW = iW.replace(/dь/g, 'ď');
    iW = iW.replace(/di/g, 'di');
    iW = iW.replace(/cь/g, 'ć');
    iW = iW.replace(/ci/g, 'ci');
    iW = iW.replace(/dzь/g, 'dź');
    iW = iW.replace(/dzi/g, 'dzi');
    iW = iW.replace(/sь/g, 'ś');
    iW = iW.replace(/zь/g, 'ź');
    iW = iW.replace(/lь/g, 'ĺ');
    iW = iW.replace(/nь/g, 'ń');
    iW = iW.replace(/ь/g, 'j');
    iW = iW.replace(/ii/g, 'i');
    iW = iW.replace(/ji/g, 'i');
    iW = iW.replace(/iy/g, 'i');
    iW = iW.replace(/jy/g, 'i');
    iW = iW.replace(/([kg])y/g, '$1i');
    iW = iW.replace(/([kg])e/g, '$1ie');
    iW = iW.replace(/jn/g, '#jn');
    iW = iW.replace(/js/g, '#js');
    iW = iW.replace(/cyj/g, 'cj');
    iW = iW.replace(/cyi/g, 'cji');
    iW = iW.replace(/lij/g, 'li');
    iW = iW.replace(/ya/g, 'ja');
    iW = iW.replace(/yą/g, 'ją');
    iW = iW.replace(/yu/g, 'ju');
    iW = iW.replace(/yo/g, 'jo');
    iW = iW.replace(/rzj/g, 'rj');
    iW = iW.replace(/#/g, '');
  }

  /* Cyrillic alphabet: 5 - standard, 6 - traditional */
  if (type == 5 || type == 6) {
    iW = iW.replace(/lj/g, 'љ');
    iW = iW.replace(/nj/g, 'њ');
    iW = iW.replace(/a/g, 'а');
    iW = iW.replace(/å/g, 'ӑ');
    iW = iW.replace(/b/g, 'б');
    iW = iW.replace(/c/g, 'ц');
    iW = iW.replace(/ć/g, 'ћ');
    iW = iW.replace(/č/g, 'ч');
    iW = iW.replace(/[dḓ]/g, 'д');
    iW = iW.replace(/ď/g, 'дь');
    iW = iW.replace(/đ/g, 'ђ');
    iW = iW.replace(/e/g, 'е');
    iW = iW.replace(/ę/g, 'ѧ');
    iW = iW.replace(/ě/g, 'є');
    iW = iW.replace(/f/g, 'ф');
    iW = iW.replace(/g/g, 'г');
    iW = iW.replace(/h/g, 'х');
    iW = iW.replace(/i/g, 'и');
    iW = iW.replace(/j/g, 'ј');
    iW = iW.replace(/k/g, 'к');
    iW = iW.replace(/l/g, 'л');
    iW = iW.replace(/ĺ/g, 'ль');
    iW = iW.replace(/m/g, 'м');
    iW = iW.replace(/n/g, 'н');
    iW = iW.replace(/ń/g, 'нь');
    iW = iW.replace(/o/g, 'о');
    iW = iW.replace(/ȯ/g, 'ъ');
    iW = iW.replace(/p/g, 'п');
    iW = iW.replace(/r/g, 'р');
    iW = iW.replace(/ř/g, 'рь');
    iW = iW.replace(/s/g, 'с');
    iW = iW.replace(/ś/g, 'сь');
    iW = iW.replace(/š/g, 'ш');
    iW = iW.replace(/[tṱ]/g, 'т');
    iW = iW.replace(/ť/g, 'ть');
    iW = iW.replace(/u/g, 'у');
    iW = iW.replace(/ų/g, 'ѫ');
    iW = iW.replace(/ŭ/g, 'ў');
    iW = iW.replace(/v/g, 'в');
    iW = iW.replace(/y/g, 'ы');
    iW = iW.replace(/z/g, 'з');
    iW = iW.replace(/ź/g, 'зь');
    iW = iW.replace(/ž/g, 'ж');
    iW = iW.replace(/’/g, 'ъ');
    iW = iW.replace(/`/g, '’');
    // extended notation
    if (flav == '1') {
      iW = iW.replace(/ṙ/g, 'ър');
      iW = iW.replace(/ŕ/g, 'ьр');
      iW = iW.replace(/ě/g, 'Ê');
      iW = iW.replace(/[ḓṱ]/g, '');
    }
    // any flavorisation
    else {
      iW = iW.replace(/[ṙŕ]/g, 'р');
      iW = iW.replace(/ė/g, 'е');
      // southern
      if (flav == 'J') {
        iW = iW.replace(/є/g, 'е');
        iW = iW.replace(/л#ј/g, 'љ');
        iW = iW.replace(/н#ј/g, 'њ');
      }
      // ethymological
      if (flav == '2') {
        //returned letter "ѣ" at the request of users
        iW = iW.replace(/є/g, 'ѣ'); // DŠ  !!!
      }
    }
    // traditional iotated cyrillic
    if (type == 6) {
      iW = iW.replace(/љ/g, 'ль');
      iW = iW.replace(/њ/g, 'нь');
      iW = iW.replace(/[êє]/g, 'ѣ');
      iW = iW.replace(/[јь]а/g, 'я');
      iW = iW.replace(/[јь]ѣ/g, 'ꙓ');
      iW = iW.replace(/[јь]ѧ/g, 'ѩ');
      iW = iW.replace(/[јь]у/g, 'ю');
      iW = iW.replace(/[јь]ѫ/g, 'ѭ');
      iW = iW.replace(/ј/g, 'й');
      iW = iW.replace(/ė/g, 'ь');
      iW = iW.replace(/ȯ/g, 'ъ');
      iW = iW.replace(/ṙ/g, 'ър');
      iW = iW.replace(/ŕ/g, 'ьр');
      iW = iW.replace(/ьь/g, 'ь');
      // extended notation
      if (flav == '1') {
        iW = iW.replace(/[йь]е/g, 'ѥ');
        iW = iW.replace(/[йь]и/g, 'ӥ');
        iW = iW.replace(/ш[чћ]/g, 'щ');
      }
      // any flavorisation
      else {
        iW = iW.replace(/([#%аеєиоуы])е/g, '$1э');
        iW = iW.replace(/([#%])й([еи])/g, '$1$2');
        iW = iW.replace(/([аеєиоуы])й([еи])/g, '$1$2');
        iW = iW.replace(/й([еи])/g, 'ь$1');
        iW = iW.replace(/ѣ/g, 'е');
        iW = iW.replace(/ьıь/g, 'ь');
      }
      iW = iW.replace(/#/g, '’');
    }
  } else if (type == 7) {
    const GL_AZU = 'ⰰ';
    const GL_BUKY = 'ⰱ';
    const GL_VEDE = 'ⰲ';
    const GL_GLAGOLI = 'ⰳ';
    const GL_DOBRO = 'ⰴ';
    const GL_YESTU = 'ⰵ';
    const GL_ZHIVETE = 'ⰶ';
    // const GL_DZELO = 'ⰷ';
    const GL_ZEMLJA = 'ⰸ';
    const GL_IZHE = 'ⰹ';
    // const GL_INITIAL_IZHE = 'ⰺ';
    const GL_I = 'ⰻ';
    const GL_DJERVI = 'ⰼ';
    const GL_KAKO = 'ⰽ';
    const GL_LJUDIJE = 'ⰾ';
    // const GL_MYSLITE = 'ⰿ';
    const GL_NASHI = 'ⱀ';
    const GL_ONU = 'ⱁ';
    const GL_POKOJI = 'ⱂ';
    const GL_RITSI = 'ⱃ';
    const GL_SLOVO = 'ⱄ';
    const GL_TVRIDO = 'ⱅ';
    const GL_UKU = 'ⱆ';
    const GL_FRITU = 'ⱇ';
    const GL_HERU = 'ⱈ';
    const GL_OTU = 'ⱉ';
    // const GL_PE = 'ⱊ';
    const GL_SHTA = 'ⱋ';
    const GL_TSI = 'ⱌ';
    const GL_CHRIVI = 'ⱍ';
    const GL_SHA = 'ⱎ';
    const GL_YERU = 'ⱏ';
    const GL_YERI = 'ⱐ';
    const GL_YATI = 'ⱑ';
    // const GL_SPIDERY_HA = 'ⱒ';
    const GL_YU = 'ⱓ';
    const GL_SMALL_YUS = 'ⱔ';
    // const GL_SMALL_YUS_WITH_TAIL = 'ⱕ';
    const GL_YO = 'ⱖ';
    const GL_IOTATED_SMALL_YUS = 'ⱗ';
    const GL_BIG_YUS = 'ⱘ';
    const GL_IOTATED_BIG_YUS = 'ⱙ';
    // const GL_FITA = 'ⱚ';
    // const GL_IZHITSA = 'ⱛ';
    // const GL_SHTAPIC = 'ⱜ';
    const GL_TROKUTASTI_A = 'ⱝ';
    const GL_LATINATE_MYSLITE = 'ⱞ';

    iW = iW.replace(/ı/g, '');
    iW = iW.replace(/ṙ/g, 'r');
    iW = iW.replace(/ř/g, 'ŕ');
    iW = iW.replace(/([čšžj])ŕ/g, '$1r');
    //standard, slovianto
    if (flav == '3' || flav == '4') {
      iW = iW.replace(/ŕ/g, 'r');
    }
    //southern
    if (flav == 'J') {
      iW = iW.replace(/ŕ/g, 'r');
      iW = iW.replace(/ȯ/g, 'o');
      iW = iW.replace(/ě/g, 'e');
    }
    iW = iW.replace(/ń/g, 'nь');
    iW = iW.replace(/ĺ/g, 'lь');
    iW = iW.replace(/ŕ/g, 'rь');
    iW = iW.replace(/ť/g, 'tь');
    iW = iW.replace(/ď/g, 'dь');
    iW = iW.replace(/ś/g, 'sь');
    iW = iW.replace(/ź/g, 'zь');
    iW = iW.replace(/([ln])ьę/g, '$1' + GL_IOTATED_SMALL_YUS);
    iW = iW.replace(/([ln])ьų/g, '$1' + GL_IOTATED_BIG_YUS);
    iW = iW.replace(/([dzrstln])ьu/g, '$1' + GL_YU);
    iW = iW.replace(/([dzrstln])ьa/g, '$1' + GL_TROKUTASTI_A);
    iW = iW.replace(/([dzrstln])ьje/g, '$1' + GL_YERI + GL_YESTU);
    iW = iW.replace(/([dzrstln])ьję/g, '$1' + GL_IOTATED_SMALL_YUS);
    iW = iW.replace(/([dzrstln])ьji/g, '$1' + GL_IZHE + GL_I);
    iW = iW.replace(/([dzrstln])ьju/g, '$1' + GL_YERI + GL_YU);
    iW = iW.replace(/([dzrstln])ьjų/g, '$1' + GL_IOTATED_BIG_YUS);
    iW = iW.replace(/([dzrstln])ьja/g, '$1' + GL_YERI + GL_TROKUTASTI_A);
    iW = iW.replace(/([dzrstln])ьjo/g, '$1' + GL_YO);

    iW = iW.replace(/([%aeėioȯuyąęųåěê])jo/g, '$1' + GL_IZHE + GL_ONU);

    iW = iW.replace(/je/g, GL_IZHE + GL_YESTU);
    iW = iW.replace(/ję/g, GL_IOTATED_SMALL_YUS);
    iW = iW.replace(/ji/g, GL_IZHE + GL_I);
    iW = iW.replace(/ju/g, GL_YU);
    iW = iW.replace(/jų/g, GL_IOTATED_BIG_YUS);
    iW = iW.replace(/ja/g, GL_TROKUTASTI_A);
    iW = iW.replace(/jo/g, GL_YO);

    iW = iW.replace(/lj/g, GL_LJUDIJE + GL_YERI);
    iW = iW.replace(/nj/g, GL_NASHI + GL_YERI);
    iW = iW.replace(/(šč|šć)/g, GL_SHTA);
    iW = iW.replace(/a/g, GL_AZU);
    iW = iW.replace(/å/g, GL_OTU);
    iW = iW.replace(/b/g, GL_BUKY);
    iW = iW.replace(/c/g, GL_TSI);
    iW = iW.replace(/ć/g, GL_SHTA);
    iW = iW.replace(/č/g, GL_CHRIVI);
    iW = iW.replace(/[dḓ]/g, GL_DOBRO);
    iW = iW.replace(/dž/g, GL_DOBRO + GL_ZHIVETE);
    iW = iW.replace(/đ/g, GL_DJERVI);
    iW = iW.replace(/[eė]/g, GL_YESTU);
    iW = iW.replace(/ę/g, GL_SMALL_YUS);
    iW = iW.replace(/[êě]/g, GL_YATI);
    iW = iW.replace(/f/g, GL_FRITU);
    iW = iW.replace(/g/g, GL_GLAGOLI);
    iW = iW.replace(/h/g, GL_HERU);
    iW = iW.replace(/i/g, GL_I);
    iW = iW.replace(/j/g, GL_IZHE);
    iW = iW.replace(/k/g, GL_KAKO);
    iW = iW.replace(/l/g, GL_LJUDIJE);
    iW = iW.replace(/m/g, GL_LATINATE_MYSLITE);
    iW = iW.replace(/n/g, GL_NASHI);
    iW = iW.replace(/o/g, GL_ONU);
    iW = iW.replace(/ȯ/g, GL_YERU);
    iW = iW.replace(/p/g, GL_POKOJI);
    iW = iW.replace(/[rṙ]/g, GL_RITSI);
    iW = iW.replace(/s/g, GL_SLOVO);
    iW = iW.replace(/š/g, GL_SHA);
    iW = iW.replace(/[tṱ]/g, GL_TVRIDO);
    iW = iW.replace(/u/g, GL_UKU);
    iW = iW.replace(/ų/g, GL_BIG_YUS);
    iW = iW.replace(/[vŭ]/g, GL_VEDE);
    iW = iW.replace(/y/g, GL_YERI + GL_IZHE);
    iW = iW.replace(/z/g, GL_ZEMLJA);
    iW = iW.replace(/ž/g, GL_ZHIVETE);
    iW = iW.replace(/ь/g, GL_YERI);
    iW = iW.replace(/[’#]/g, GL_YERU);
    iW = iW.replace(/`/g, '’');
  } else if (type == 10) {
    /* IPA */
    iW = iW.replace(/nads([eę])/g, 'nac$1');
    iW = iW.replace(/([ĺńřťďśź])ıj/g, '$1i̯');
    iW = iW.replace(/e/g, 'ɛ');
    iW = iW.replace(/ė/g, 'ɜ');
    iW = iW.replace(/ě/g, 'ьɛ');
    iW = iW.replace(/ę/g, 'ьæ');
    iW = iW.replace(/ŕ/g, 'ьǝr');
    iW = iW.replace(/([ščžj])ь/g, '$1');
    iW = iW.replace(/y/g, 'ɪ');
    iW = iW.replace(/å/g, 'ɒ');
    iW = iW.replace(/o/g, 'ɔ');
    iW = iW.replace(/[ŕṙ]/g, 'ər');
    iW = iW.replace(/[ȯ’]/g, 'ə');
    iW = iW.replace(/ų/g, 'ʊ');
    iW = iW.replace(/c/g, 't͡s');
    iW = iW.replace(/č/g, 't͡ʃ');
    iW = iW.replace(/šć/g, 'ɕt͡ɕ');
    iW = iW.replace(/ć/g, 't͡ɕ');
    iW = iW.replace(/dz/g, 'd͡z');
    iW = iW.replace(/dž/g, 'd͡ʒ');
    iW = iW.replace(/žđ/g, 'ʑd͡ʑ');
    iW = iW.replace(/đ/g, 'd͡ʑ');
    iW = iW.replace(/x/g, 'ks');
    iW = iW.replace(/h/g, 'x');
    iW = iW.replace(/š/g, 'ʃ');
    iW = iW.replace(/ž/g, 'ʒ');
    iW = iW.replace(/sť/g, 'sʲtʲ');
    iW = iW.replace(/zď/g, 'zʲdʲ');
    iW = iW.replace(/ť/g, 'tʲ');
    iW = iW.replace(/tь/g, 'tʲ');
    iW = iW.replace(/ď/g, 'dʲ');
    iW = iW.replace(/dь/g, 'dʲ');
    iW = iW.replace(/ś/g, 'sʲ');
    iW = iW.replace(/sь/g, 'sʲ');
    iW = iW.replace(/ź/g, 'zʲ');
    iW = iW.replace(/zь/g, 'zʲ');
    iW = iW.replace(/ř/g, 'rʲ');
    iW = iW.replace(/r[ьj]/g, 'rʲ');
    iW = iW.replace(/ń/g, 'ɲ');
    iW = iW.replace(/n[ьj]/g, 'ɲ');
    iW = iW.replace(/ĺ/g, 'ʎ');
    iW = iW.replace(/l[ьj]/g, 'ʎ');
    iW = iW.replace(/ь/g, 'j');
    iW = iW.replace(/l/g, 'ɫ');
    // eslint-disable-next-line no-misleading-character-class
    iW = iW.replace(/ɫ([ii̯e])/g, 'l$1');
    iW = iW.replace(/t͡sj/g, 't͡sʲ');
    iW = iW.replace(/d͡zj/g, 'd͡zʲ');
  }

  iW = iW.replace(/jj/g, 'j');
  iW = iW.replace(/[#ı%]/g, '');
  OrigW = OrigW.replace(/%/g, '');

  /** Hoofdletters maken **/
  const iW_first = iW.charAt(0);
  const iW_rest = iW.substring(1);

  if (type == 10 || OrigW.charAt(0) == OrigW.charAt(0).toLowerCase()) {
    iW = iW.toLowerCase();
  } else if (
    OrigW.length > 1 &&
    OrigW.charAt(1) == OrigW.charAt(1).toLowerCase()
  ) {
    iW = iW_first.toUpperCase() + iW_rest.toLowerCase();
  } else {
    iW = iW.toUpperCase();
  }

  iW = iW.replace(/℅/g, '%');
  return iW;
}

function jgedoe(iW: string) {
  /* (V)j(V)	= j */
  /* Cj(C)  	= Ь */
  /* CjV		= ь */

  iW = iW.replace(/ć/g, 'cj');
  iW = iW.replace(/đ/g, 'dzj');
  iW = iW.replace(/ĺ/g, 'lj');
  iW = iW.replace(/ń/g, 'nj');
  iW = iW.replace(/ř/g, 'rj');
  iW = iW.replace(/ď/g, 'dj');
  iW = iW.replace(/ť/g, 'tj');
  iW = iW.replace(/ś/g, 'sj');
  iW = iW.replace(/ź/g, 'zj');

  let i = 0;
  const wLength = iW.length;
  let nextChar = '';
  let resC = '';
  let result = '';

  while (i < wLength) {
    nextChar = iW.charAt(i);
    resC = nextChar;
    const vowel = /[aäåeęěėioȯuųyъ]/;

    switch (nextChar) {
      case 'j':
        if (iW.charAt(i - 1) == '%') {
          resC = 'j';
          break;
        } else if (iW.charAt(i - 1) == '#') {
          resC = 'j';
          break;
        } else if (iW.charAt(i - 1) == 'j') {
          resC = 'j';
          break;
        } else if (
          vowel.test(iW.charAt(i - 1)) == false &&
          vowel.test(iW.charAt(i + 1)) == true
        ) {
          resC = 'ь';
          break;
        } else if (
          vowel.test(iW.charAt(i - 1)) == false &&
          vowel.test(iW.charAt(i + 1)) == false
        ) {
          resC = 'Ь';
          break;
        } else {
          resC = 'j';
          break;
        }
    }
    i++;
    result += resC;
  }
  return result;
}
