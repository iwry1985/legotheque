import { Optional } from '@nestjs/common';
import { ApiOAuth2, ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ThemeDto } from '../theme/theme.dto';

export class LegosetDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    setid: number;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    reference: number;

    @Optional()
    @IsInt()
    @ApiProperty()
    variant?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    bricksetid: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    year: number;

    @Optional()
    @IsString()
    @ApiProperty()
    category?: string;

    @IsBoolean()
    @ApiProperty()
    released: boolean;

    @IsInt()
    @ApiProperty()
    pieces: number;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    launchdate?: Date;

    @IsOptional()
    @IsString()
    @ApiProperty()
    thumbnail?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    retailprice?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    rating?: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    minage?: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    tags?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    height?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    width?: number;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    exitdate?: Date;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    minifigs?: number;

    @IsOptional()
    @IsInt()
    @ApiProperty()
    reviewcount?: number;

    // @IsNotEmpty()
    // @IsNumber()
    // themeid: number;

    @IsNotEmpty()
    @IsDate()
    lastupdatedat: Date;

    @IsNotEmpty()
    @ApiProperty()
    theme: ThemeDto;
}
