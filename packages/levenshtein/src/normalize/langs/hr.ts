import { mapStep, regexStep, type Step } from '../steps.ts';

export const hr: readonly Step[] = [
  // only the ijekavian trigraph is jat (rijeka→rěka); plain je stays (jezik)
  regexStep('hr-jat', /ije/g, 'ě'),
  // ISV standard writes ć as č and đ as dž (noć→noč, međa→medža)
  mapStep('hr-letters', { ć: 'č', đ: 'dž' }),
];
