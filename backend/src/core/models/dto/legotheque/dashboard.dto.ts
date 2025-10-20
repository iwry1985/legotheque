import {
    IsArray,
    IsDecimal,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

class ChartDatasetDto {
    @IsOptional()
    @IsString()
    label?: string;

    @IsNotEmpty()
    @IsArray()
    data: number[] = [];

    @IsOptional()
    @IsString()
    @IsIn(['bar', 'line', 'pipe', 'doughnut'])
    type?: string;
}

class ChartBlockDto {
    @IsNotEmpty()
    @IsArray()
    labels: string[] = [];

    @IsNotEmpty()
    @IsArray()
    datasets: ChartDatasetDto[] = [];
}

class TopItemDto {
    @IsOptional()
    @IsString()
    label?: string;

    @IsOptional()
    @IsDecimal()
    value?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsDecimal()
    price?: number;
}

class TopsDto {
    @IsOptional()
    @IsArray()
    themesBuilt?: TopItemDto[];

    @IsOptional()
    @IsArray()
    expensiveSets?: TopItemDto[];
}

class DashSummaryDto {
    @IsNotEmpty()
    @IsInt()
    totalSets: number = 0;

    @IsNotEmpty()
    @IsInt()
    totalBuilt: number = 0;

    @IsNotEmpty()
    @IsInt()
    totalGifts: number = 0;

    @IsNotEmpty()
    @IsDecimal()
    totalValue: number = 0;

    @IsNotEmpty()
    @IsDecimal()
    avgPieces: number = 0;

    @IsNotEmpty()
    @IsDecimal()
    builtRatio: number = 0;

    @IsNotEmpty()
    @IsDecimal()
    giftsRatio: number = 0;
}

export class DashboardDto {
    @IsNotEmpty()
    summary: DashSummaryDto;

    @IsOptional()
    purchases?: ChartBlockDto;

    @IsOptional()
    themes?: ChartBlockDto;

    @IsOptional()
    minifigs?: ChartBlockDto;

    @IsOptional()
    priceHistogram?: ChartBlockDto;

    @IsOptional()
    piecesHistogram?: ChartBlockDto;

    @IsOptional()
    progression?: ChartBlockDto;

    @IsOptional()
    tops?: TopsDto;
}
