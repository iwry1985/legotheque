import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class UserLegothequeDto {
    @IsInt()
    @ApiProperty()
    totalSets: number = 0;

    @IsInt()
    @ApiProperty()
    totalDone: number = 0;

    @IsInt()
    @ApiProperty()
    totalBricks: number = 0;

    @IsInt()
    @ApiProperty()
    bricksDone: number = 0;

    @IsInt()
    @ApiProperty()
    bricksLeft: number = 0;

    @IsInt()
    @ApiProperty()
    @IsOptional()
    oldestYear?: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    oldestName?: string;

    @IsInt()
    @ApiProperty()
    totalThemes: number = 0;

    @IsInt()
    @ApiProperty()
    @IsOptional()
    mostBricks?: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    mostBricksName?: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    mostOwnedTheme?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    lastBought?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    oldestNotBuilt?: string;

    @IsDecimal()
    @ApiProperty()
    estimatedValue: number = 0;
}
