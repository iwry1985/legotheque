export interface ILegotheque {
  legothequeid: number;
  userid: number;
  setid: number;
  owned?: boolean;
  built?: boolean;
  ownedat?: Date;
  builtat?: Date;
  builtbeginat?: Date;
  gift?: boolean;
  purchaseprice?: number;
  fav?: boolean;
  addedat?: Date;
}
