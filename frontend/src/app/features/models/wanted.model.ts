export interface IWanted {
  wantedid: number;
  userid: number;
  setid: number;
  priority?: string;
  note?: string;
  wantedat: Date;
  boughtat?: Date;
}
