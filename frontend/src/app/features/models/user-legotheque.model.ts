export interface IUserLegotheque {
  totalSets: number;
  totalDone: number;
  totalBricks: number;
  bricksDone: number;
  bricksLeft: number;
  oldestYear?: number;
  oldestName?: string;
  totalThemes: number;
  mostBricks?: number;
  mostBricksName?: string;
  mostOwnedTheme?: string;
  lastBought?: string;
  oldestNotBuilt?: string;
  estimatedValue: number;
}
