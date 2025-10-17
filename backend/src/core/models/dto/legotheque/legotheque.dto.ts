import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDate,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';
import { LegosetDto } from '../legoset/legoset.dto';
import { Type } from 'class-transformer';

export class LegothequeDto {
    @IsNotEmpty()
    @IsInt()
    legothequeid: number;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    userid: number;

    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    setid: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    owned?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    built?: boolean;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    ownedat?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    builtat?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    builtbeginat?: Date;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    gift?: boolean;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    purchaseprice?: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    fav?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    lastupdatedat?: Date;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    addedat?: Date;

    @IsOptional()
    @ApiProperty()
    set: LegosetDto;
}
