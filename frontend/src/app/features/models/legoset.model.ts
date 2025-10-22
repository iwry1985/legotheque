import { ITheme } from './theme.model';

export interface ILegoset {
  setid: number;
  bricksetid: string;
  reference: number;
  variant: number;
  name: string;
  year: number;
  released: boolean;
  pieces: number;
  launchdate?: Date;
  thumbnail?: string;
  retailprice?: number;
  rating?: number;
  minage?: number;
  description?: string;
  height?: number;
  width?: number;
  exitdate?: Date;
  minifigs?: number;
  reviewcount?: number;
  theme: ITheme;
  retired: boolean;
  newest: boolean;
  retiredSoon: boolean;
}
