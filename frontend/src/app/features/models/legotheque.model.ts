import { ILegoset } from './legoset.model';

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
  set?: ILegoset;
}

//partial => pour rendre tout optionnel
//Omit => pour exclure les fields listés
export type ILegothequeUpdate = Partial<
  Omit<
    ILegotheque,
    'legothequeid' | 'userid' | 'setid' | 'owned' | 'addedat' | 'set'
  >
>;

export const UPDATE_LEGOTHEQUE_OMIT_KEYS: (keyof ILegotheque)[] = [
  'legothequeid',
  'userid',
  'setid',
  'owned',
  'addedat',
  'set',
];
