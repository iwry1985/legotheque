import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { LegosetDto } from './legoset.dto';

export class LegosetListDto {
    @IsInt()
    @ApiProperty()
    total: number;

    @IsInt()
    @ApiProperty()
    limit: number;

    @IsInt()
    @ApiProperty()
    page: number;

    @ApiProperty()
    data: LegosetDto[];

    @IsInt()
    @ApiProperty()
    pageCount: number;
}
