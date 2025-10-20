interface IChartDataset {
  label: string;
  data: number[];
  type: string;
}

interface IChartBlock {
  labels: string[];
  datasets: IChartDataset[];
}

interface ITopItem {
  label?: string;
  value?: string;
  name?: string;
  price?: number;
}

interface ITops {
  themesBuilt?: ITopItem[];
  expensiveSets?: ITopItem[];
}

interface IDashSummary {
  totalSets: number;
  totalBuilt: number;
  totalGifts: number;
  totalValue: number;
  avgPieces: number;
  builtRatio: number;
  giftsRatio: number;
}

export interface IDashboard {
  summary: IDashSummary;
  purchases?: IChartBlock;
  themes?: IChartBlock;
  minifigs?: IChartBlock;
  priceHistogram?: IChartBlock;
  piecesHistohram?: IChartBlock;
  progression?: IChartBlock;
  tops?: ITops;
}
