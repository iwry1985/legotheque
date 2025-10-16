export interface ILegotheque {
  legothequeid: number;
  userid: number;
  setid: number;
  owned?: boolean;
  wanted?: boolean;
  built?: boolean;
  wantedat?: Date;
  ownedat?: Date;
  builtat?: Date;
  builtbeginat?: Date;
  gift?: boolean;
  purchaseprice?: number;
  fav?: boolean;
  addedat?: boolean;
}
