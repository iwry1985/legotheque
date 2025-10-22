export interface ISecondaryMarket {
  current: ICondition;
  last6Months: ICondition;
}

export interface ICondition {
  new: IPriceRange;
  used: IPriceRange;
}

interface IPriceRange {
  min?: number;
  max?: number;
  avg?: number;
}
