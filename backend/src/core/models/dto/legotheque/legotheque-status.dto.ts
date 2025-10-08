import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty()
    date?: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(['add', 'remove'])
    type: string = 'add';
}
