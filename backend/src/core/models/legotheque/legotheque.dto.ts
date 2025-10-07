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
    wanted?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    built?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    ownedat?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    wantedat?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    builtat?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    builtbeginat?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    giftt?: boolean;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    purchaseprice?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    lastupdatedat?: boolean;

    @IsOptional()
    @IsDate()
    @ApiProperty()
    addedat?: boolean;
}
