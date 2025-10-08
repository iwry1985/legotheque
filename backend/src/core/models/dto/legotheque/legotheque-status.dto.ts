import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class ChangeStatusLegothequeDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['owned', 'wanted', 'built'])
    @ApiProperty()
    status: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    date?: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(['add', 'remove'])
    @ApiProperty()
    type: string = 'add';
}
