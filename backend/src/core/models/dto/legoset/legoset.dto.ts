//DTO = data transfer object

import { Optional } from '@nestjs/common';
import { ApiOAuth2, ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDate,
    IsDecimal,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ThemeDto } from '../theme/theme.dto';
import { Expose, Type } from 'class-transformer';

export class LegosetDto {
    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    setid: number;

    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    reference: number;

    @Expose()
    @Optional()
    @IsInt()
    @ApiProperty()
    variant?: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    bricksetid: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    year: number;

    @Expose()
    @Optional()
    @IsString()
    @ApiProperty()
    category?: string;

    @Expose()
    @IsBoolean()
    @ApiProperty()
    released: boolean;

    @Expose()
    @IsInt()
    @ApiProperty()
    pieces: number;

    @Expose()
    @IsOptional()
    @IsDate()
    @ApiProperty()
    launchdate?: Date;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty()
    thumbnail?: string;

    @Expose()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    retailprice?: number;

    @Expose()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    rating?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    minage?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty()
    tags?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty()
    description?: string;

    @Expose()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    height?: number;

    @Expose()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    width?: number;

    @Expose()
    @IsOptional()
    @IsDate()
    @ApiProperty()
    exitdate?: Date;

    @Expose()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    minifigs?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @ApiProperty()
    reviewcount?: number;

    // @IsNotEmpty()
    // @IsNumber()
    // themeid: number;

    @Expose()
    @IsNotEmpty()
    @IsDate()
    lastupdatedat: Date;

    @Expose()
    @IsNotEmpty()
    @ApiProperty()
    @Type(() => ThemeDto)
    theme: ThemeDto;

    @Expose()
    @IsBoolean()
    @ApiProperty()
    retired?: boolean;

    @Expose()
    @ApiProperty()
    @IsBoolean()
    newest?: boolean;

    @Expose()
    @ApiProperty()
    @IsBoolean()
    retiredSoon?: boolean;
}
