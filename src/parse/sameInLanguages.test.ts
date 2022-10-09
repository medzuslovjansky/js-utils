import parseSameInLanguages from './sameInLanguages';

describe('parseSameInLanguages', () => {
  it.each([
    [''],
    ['cs sh~ bg~'],
    ['j z'],
    ['ru cs (sh)'],
    ['ru yu'],
    ['ru# yu* mk~'],
    ['rue cs yu'],
    ['ub~ z j'],
    ['uk z bg'],
    ['v csb hsb cs'],
    ['v pl csb'],
    ['v pl sk~'],
    ['v sk j~'],
    ['v z yu~'],
    ['z'],
    ['z~ sh~'],
  ])('should parse correctly in legacy mode: %j', (encoded) => {
    const report = parseSameInLanguages(encoded, true);
    expect(report.toString()).toMatchSnapshot();
    const secondary = parseSameInLanguages(report.toString(), false);
    expect(secondary).toEqual(report);
  });

  it.each([
    [''],
    ['!be+ cs# !ru+ uk+ pl*'],
    ['!v+ z#'],
    ['!bg+ cz~ mk+'],
    ['sh* sl+'],
  ])('should parse correctly in new mode: %j', (encoded) => {
    const report = parseSameInLanguages(encoded);
    expect(report.toString()).toMatchSnapshot();
  });
});
