export interface Word {
  form: string;
  lemma: string;
  uPosTag: string;
  xPosTag?: string;
  feats: object;
}
